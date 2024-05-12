const Repas = require("../model/Repas.js");

async function add(req, res, next) {
  try {
    // Si aucune date n'est fournie dans la requête, utilisez la date système
    if (!req.body.jour) {
      req.body.jour = new Date();
    }

    const repas = new Repas(req.body);
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
