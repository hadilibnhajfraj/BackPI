const Repas = require("../model/Repas.js");
const Alergie = require("../model/Alergie");
const mongoose = require("mongoose");

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
    const data = await Repas.find().populate("allergiesEleve", "allergene");
    console.log(JSON.stringify(data, null, 2)); // Vérifiez ici
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
}
async function update(req, res, next) {
  try {
    if (!req.body.jour) {
      req.body.jour = new Date();
    }

    const allergies = await Alergie.find({
      _id: { $in: req.body.allergiesEleve }
    });
    const allergieIds = allergies.map(allergie => allergie._id);

    const updatedData = {
      ...req.body,
      allergiesEleve: allergieIds
    };

    const updatedRepas = await Repas.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate('allergiesEleve');

    if (!updatedRepas) {
      return res.status(404).json({ message: 'Repas not found' });
    }

    res.json(updatedRepas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update repas' });
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
    const repas = await Repas.findById(req.params.id).populate(
      "allergiesEleve"
    );
    if (!repas) {
      return res.status(404).send("Repas not found");
    }
    res.json(repas);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching repas");
  }
}
const getRepasAllergie = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the repas with the specified id and populate the allergies
    const repas = await Repas.findById(id).populate("allergiesEleve").exec();

    if (!repas) {
      return res.status(404).json({ message: "Repas not found" });
    }

    const repasAllergies = repas.allergiesEleve;

    // Fetch all allergies
    const allAllergies = await Alergie.find().exec();

    res.json({ repasAllergies, allAllergies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching allergenes for the repas", error });
  }
};

async function updateAllergieRepas(req, res) {
  try {
    const repasId = req.params.id;
    const { allergiesEleve } = req.body;

    const updatedRepas = await Repas.findByIdAndUpdate(
      repasId,
      { allergiesEleve },
      { new: true }
    ).populate("allergiesEleve");

    if (!updatedRepas) {
      return res.status(404).json({ message: "Repas not found" });
    }

    res.send(updatedRepas);
  } catch (error) {
    res.status(500).json({ message: "Error updating repas allergies", error });
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
    res.status(500).json({
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
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des repas.",
    });
  }
}
// Fonction utilitaire pour vérifier si une date est valide
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}




module.exports = {
  add,
  show,
  update,
  deleteRepas,
  showRepasDate,
  getAllRepas,
  getRepas,
  getRepasAllergie,
  updateAllergieRepas,
 
};
