const Classe = require("../model/class");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const classe = new Classe(req.body);
    await classe.save();
    res.send("classroom add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Classe.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Classe.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteclass(req, res, next) {
  try {
    await Classe.findByIdAndDelete(req.params.id);
    res.send("remouved");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deleteclass };