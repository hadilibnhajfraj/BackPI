const Cours = require("../model/cours");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const cours = new Cours(req.body);
    await cours.save();
    res.send("cours add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Cours.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Cours.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deletecours(req, res, next) {
  try {
    await Cours.findByIdAndDelete(req.params.id);
    res.send("remouved");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deletecours };