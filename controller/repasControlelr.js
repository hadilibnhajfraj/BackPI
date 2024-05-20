const Repas = require("../model/Repas.js");
const Alergie = require("../model/Alergie");
async function add(req, res, next) {
  try {
    if (!req.body.jour) {
      req.body.jour = new Date();
    }

    // Récupérer les identifiants des allergies sélectionnées
    const allergies = await Alergie.find({ allergene: { $in: req.body.allergiesEleve } });
    const allergieIds = allergies.map(allergie => allergie._id);

    const repas = new Repas({
      ...req.body,
      allergiesEleve: allergieIds
    });

    await repas.save();

    res.status(200).send("Repas ajouté avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'ajout du repas");
  }
}
async function show(req, res, next) {
  try {
    const data = await Repas.find();
    res.json(data);
  } catch (err) {
    console.log(err);
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
    res.send("Removed");
  } catch (err) {
    console.log(err);
  }
}
module.exports = { add, show, update, deleteRepas };
