const User = require("../model/user");

async function add(req, res, next) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send("operation added successfully");
    } catch (err) {
        console.error(err);
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
        const data = await User.findByIdAndUpdate(req.params.id, req.body);
        res.send("updated");
    } catch (err) { }
}
async function deleteuser(req, res, next) {
    try {
        const data = await User.findByIdAndDelete(req.params.id, req.body);
        res.send("removed");
    }
    catch (err) { }
}

module.exports = {
    add,
    show,
    update,
    deleteuser,
}