const User = require("../model/user");

async function add(req, res, next) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send("User add");
    } catch (err) {
        console.log(err);
    }
}

async function show(req, res, next) {
    try {
        const data = await User.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Classe updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("Classe deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await User.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await User.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };