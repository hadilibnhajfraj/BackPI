const Seance = require("../model/seance");
const Salle = require('../model/salle'); // Assuming you have a Salle model
const User = require('../model/user');
const nodemailer = require('nodemailer');
const Classe = require("../model/class");
const Etudiant = require('../model/eleve');
const Emploi = require('../model/emploi')

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const seance = new Seance(req.body);
    await seance.save();
    res.send("seance add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Seance.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Seance.findByIdAndUpdate(req.params.id, req.body);
    res.send({message:"updated"});
  } catch (err) {
    console.log(err);
  }
}

async function deleted(req, res, next) {
  try {
    // Trouver la séance à supprimer
    const seanceId = req.params.id;
    const seance = await Seance.findById(seanceId);
    if (!seance) {
      return res.status(404).send("Séance non trouvée.");
    }

    // Trouver l'emploi auquel appartient la séance
    const emploi = await Emploi.findById(seance.emploie);
    if (!emploi) {
      return res.status(404).send("Emploi non trouvé.");
    }

    // Supprimer la séance de la base de données
    await Seance.findByIdAndDelete(seanceId);

    // Mettre à jour l'emploi pour supprimer la référence à la séance
    emploi.seances = emploi.seances.filter(id => id.toString() !== seanceId);
    await emploi.save();

    res.send({message : "Séance supprimée et emploi mis à jour."});
  } catch (err) {
    console.log(err);
    res.status(500).send("Une erreur est survenue lors de la suppression de la séance.");
  }
}

const seanceTimes = {
  1: { heure_debut: 8, heure_fin: 9 },
  2: { heure_debut: 9, heure_fin: 10 },
  3: { heure_debut: 10, heure_fin: 11 },
  4: { heure_debut: 11, heure_fin: 12 },
  5: { heure_debut: 13, heure_fin: 14 },
  6: { heure_debut: 14, heure_fin: 15 },
  7: { heure_debut: 15, heure_fin: 16 },
  8: { heure_debut: 16, heure_fin: 17 },
};

async function getAvailableOptions(date, num_seance) {
  const { heure_debut, heure_fin } = seanceTimes[num_seance];

  const allSalles = await Salle.find({});
  const allEnseignants = await User.find({ authorities: 'enseignant' });

  const unavailableSalles = await Seance.find({
    date: date,
    heure_debut: { $lt: heure_fin },
    heure_fin: { $gt: heure_debut }
  }).distinct('salle');

  const unavailableEnseignants = await Seance.find({
    date: date,
    heure_debut: { $lt: heure_fin },
    heure_fin: { $gt: heure_debut }
  }).distinct('enseignant');
  console.log(unavailableSalles, unavailableEnseignants)

  const availableSalles = allSalles.filter(salle => !unavailableSalles.map(id => id.toString()).includes(salle._id.toString()));
  const availableEnseignants = allEnseignants.filter(enseignant => !unavailableEnseignants.map(id => id.toString()).includes(enseignant._id.toString()));

  console.log(availableSalles, availableEnseignants)
  return { availableSalles, availableEnseignants };

}

async function fetchAvailableOptions(req, res) {
  try {
    const { date, num_seance } = req.query;

    const { availableSalles, availableEnseignants } = await getAvailableOptions(date, num_seance);

    res.status(200).json({ availableSalles, availableEnseignants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching options' });
  }
}


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "t0429597@gmail.com",
    pass: "frrz sozl ivqu fudj",
  },
  secure: true, // Utilisez le port sécurisé
  port: 587, // Port sécurisé pour Gmail
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 't0429597@gmail.com',
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

async function cancelSeance(req, res) {
  try {
    const seanceId = req.params.id;

    // Trouver la séance à supprimer
    const seance = await Seance.findById(seanceId).populate('enseignant').populate('class');
    if (!seance) {
      return res.status(404).json({ message: 'Seance not found' });
    }
    // Trouver l'emploi du temps lié à cette séance
    const emploi = await Emploi.findById(seance.emploie);
    if (!emploi) {
      return res.status(404).json({ message: 'Emploi not found' });
    }
    // Mettre à jour l'emploi pour supprimer la référence à la séance
    emploi.seances = emploi.seances.filter(id => id.toString() !== seanceId);
    await emploi.save();

    // Extraire les détails nécessaires
    const { enseignant, class: seanceClass, date, heure_debut, heure_fin } = seance;

    // Supprimer la séance
    await Seance.findByIdAndDelete(seanceId);

    // Récupérer les étudiants de la classe
    const classDetails = await Classe.findById(seanceClass._id).populate('students');
    const students = classDetails.students;
    console.log ("sddd : " + students )

    // Récupérer les parents des étudiants
    const parentIds = students.map(student => student.id_user);
    console.log("parents : " + parentIds)
    const parents = await User.find({ _id: { $in: parentIds }, authorities: 'parent' });

    // Récupérer tous les administrateurs
    const admins = await User.find({ authorities: 'admin' });

    // Préparer le contenu de l'e-mail
    const emailSubject = 'Annulation de séance';
    const emailText = `La séance prévue le ${date.toISOString().split('T')[0]} de ${heure_debut}h à ${heure_fin}h a été annulée.`;

    // Envoyer les e-mails
    const emailPromises = [
      sendEmail(enseignant.email, emailSubject, emailText),
      ...parents.map(parent => sendEmail(parent.email, emailSubject, emailText)),
      ...admins.map(admin => sendEmail(admin.email, emailSubject, emailText))
    ];

    await Promise.all(emailPromises);

    res.status(200).json({ message: 'Seance cancelled and emails sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while cancelling the seance' });
  }
};

async function findSeance(req, res, next) {
  try {
    const data = await Seance.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'seance not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
}



module.exports = { add, show, update, deleted, getAvailableOptions, fetchAvailableOptions, cancelSeance, findSeance };