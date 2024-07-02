const Salle = require("../model/salle");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const salle = new Salle(req.body);
    await salle.save();
    res.send({message :"salle add"});
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await Salle.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Salle.findByIdAndUpdate(req.params.id, req.body);
    res.send({message :"updated"});
  } catch (err) {
    console.log(err);
  }
}

async function deleted(req, res, next) {
  try {
    await Salle.findByIdAndDelete(req.params.id);
    res.send({message :"remouved"});
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deleted };