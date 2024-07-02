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
    res.send("remouved");
  } catch (err) {
    console.log(err);
  }
}
async function showParents(req, res, next) {
  try {
    const parents = await User.find({ authorities: 'parent' }); // Assuming role field distinguishes parents
    res.json(parents);
  } catch (err) {
    console.log(err);
  }
}

async function findUser(req, res, next) {
  try {
    const data = await User.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'seance not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
}

module.exports = { add, show, update, deleteuser,showParents, findUser };