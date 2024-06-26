const Alergie = require("../model/Alergie");
const User = require("../model/user");
async function getAllEtudiantIds() {
  try {
    const etudiants = await User.find({}, '_id'); // Récupère uniquement les ID des étudiants
    return etudiants.map(etudiant => etudiant._id);
  } catch (err) {
    console.error("Erreur lors de la récupération des ID des étudiants :", err);
    throw err;
  }
}
async function getAll(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));

    const etudiantIds = await getAllEtudiantIds();

    // Rendre la vue avec les ID des étudiants disponibles
    res.json({ etudiantIds });

  } catch (err) {
    console.error("Erreur lors de l'ajout d'allergie :", err);
    res.status(500).send("Erreur lors de l'ajout d'allergie");
  }
}
async function add(req, res, next) {
  try {
    const existingAlergie = await Alergie.findOne({ allergene: req.body.allergene });
    if (existingAlergie) {
      return res.status(400).json({ message: "L'allergène existe déjà" });
    }

    const alergie = new Alergie(req.body);
    await alergie.save();
    res.status(200).json({ message: "Alergie ajoutée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'allergie" });
  }
}

async function show(req, res, next) {
  try {
    const data = await Alergie.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Alergie.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteAlergie(req, res, next) {
  try {
    await Alergie.findByIdAndDelete(req.params.id);
    res.send("Removed");
  } catch (err) {
    console.log(err);
  }
}
module.exports = { getAll,add,update,show,deleteAlergie };
