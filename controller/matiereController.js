const Matiere = require("../model/matiere");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const matiere = new Matiere(req.body);
    await matiere.save();
    res.send("Matiere add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Matiere.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Matiere.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleted(req, res, next) {
  try {
    await Matiere.findByIdAndDelete(req.params.id);
    res.send("remouved");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deleted };