const Etudiant = require("../model/etudiant");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const etudiant = new Etudiant(req.body);
    await etudiant.save();
    res.send("etudiant add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Etudiant.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Etudiant.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteetudiant(req, res, next) {
  try {
    await Etudiant.findByIdAndDelete(req.params.id);
    res.send("remouved");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deleteetudiant };