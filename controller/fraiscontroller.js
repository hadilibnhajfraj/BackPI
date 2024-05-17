const Frais = require("../model/frais");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const frais = new Frais(req.body);
    await frais.save();
    res.send("frais add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Frais.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Frais.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deletefrais(req, res, next) {
  try {
    await Frais.findByIdAndDelete(req.params.id);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deletefrais };