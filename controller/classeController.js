const Classe = require("../model/class");
const Enseignant = require('../model/user');
const Etudiant = require('../model/eleve');
const Cours = require('../model/cours');
const Emploi = require('../model/emploi');

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const classe = new Classe(req.body);
    await classe.save();
    res.send({ message: "classroom add" });
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Classe.find()
      .populate({
        path: 'teachers',
        model: Enseignant,
        select: 'firstName lastName'
      })
      .populate({
        path: 'students',
        model: Etudiant,
        select: 'prenom nom'
      }).populate({
        path: 'courses',
        model: Cours,
        select: 'nom'
      }).populate({
        path: 'emploies',
        model: Emploi,
        select: 'file'
      });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send('Erreur serveur');
  }
}

async function update(req, res, next) {
  try {
    await Classe.findByIdAndUpdate(req.params.id, req.body);
    res.send({ message: "updated" });
  } catch (err) {
    console.log(err);
  }
}

async function deleteclass(req, res, next) {
  try {
    await Classe.findByIdAndDelete(req.params.id);
    res.send({ message: "remouved" });
  } catch (err) {
    console.log(err);
  }
}




module.exports = { add, show, update, deleteclass };