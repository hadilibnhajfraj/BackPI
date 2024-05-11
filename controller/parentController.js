const Parent = require("../model/parent");

async function add(req, res, next) {
    try {
        const parent = new Parent(req.body);
        await parent.save();
        res.status(200).send("Parent add");
    } catch (err) {
        console.log(err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Parent.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Parent.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Parent updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Parent.findByIdAndDelete(req.params.id);
        res.status(200).send("Parent deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Parent.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Parent.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };