const User = require("../model/user");

async function add(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const user = new User(req.body);
    await user.save();
    res.send("user add");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res, next) {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteuser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { add, show, update, deleteuser };