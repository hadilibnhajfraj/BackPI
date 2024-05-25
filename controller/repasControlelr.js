const Repas = require("../model/Repas.js");
const Alergie = require("../model/Alergie");
async function add(req, res, next) {
  try {
    if (!req.body.jour) {
      req.body.jour = new Date();
    }

    // Récupérer les identifiants des allergies sélectionnées
    const allergies = await Alergie.find({
      allergene: { $in: req.body.allergiesEleve },
    });
    const allergieIds = allergies.map((allergie) => allergie._id);

    const repas = new Repas({
      ...req.body,
      allergiesEleve: allergieIds,
    });

    await repas.save();

    res.status(200).json("Repas ajouté avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).json("Erreur lors de l'ajout du repas");
  }
}
async function show(req, res, next) {
  try {
    const data = await Repas.find().populate('allergiesEleve', 'allergene');
    console.log(JSON.stringify(data, null, 2));  // Vérifiez ici
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
}


async function update(req, res, next) {
  try {
    await Repas.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteRepas(req, res, next) {
  try {
    await Repas.findByIdAndDelete(req.params.id);
    res.status(200).json("Removed");
  } catch (err) {
    console.log(err);
  }
}
async function getRepas(req, res, next) {
  try {
    const repas = await Repas.findById(req.params.id);
    if (!repas) {
      return res.status(404).send("Repas not found");
    }
    res.json(repas);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching repas");
  }
}

async function showRepasDate(req, res, next) {
  try {
    // Récupérer la date de la requête
    const dateString = req.query.date; // Assurez-vous que le paramètre de requête est nommé "date"
    
    // Convertir la chaîne de caractères en objet Date
    const date = new Date(dateString);

    // Vérifier si la date est valide
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Format de date invalide." });
    }

    // Rechercher les repas pour la date donnée
    const repas = await Repas.find({
      jour: { $gte: date, $lt: new Date(date.getTime() + 86400000) },
    }).exec();

    // Envoyer la réponse avec les repas trouvés
    res.json(repas);
    console.log(repas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Une erreur s'est produite lors de la récupération des repas.",
      });
  }
}
async function getAllRepas(req, res) {
  try {
      const repas = await Repas.find().sort({ jour: 1 }); // Tri par date croissante
      res.json(repas);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des repas." });
  }
}
// Fonction utilitaire pour vérifier si une date est valide
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

module.exports = { add, show, update, deleteRepas, showRepasDate , getAllRepas , getRepas };
