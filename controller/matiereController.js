const Matiere = require("../model/matiere");

async function add(req, res, next) {
    try {
        const matiere = new Matiere(req.body);
        await matiere.save();
        res.status(200).json("Matiere add");
    } catch (err) {
        console.log(err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Matiere.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        const updatedMatiere = await Matiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMatiere) {
            return res.status(404).json({ error: "Matiere not found" });
        }
        res.status(200).json(updatedMatiere);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

async function deleted(req, res, next) {
    try {
        await Matiere.findByIdAndDelete(req.params.id);
        res.status(200).json("Matiere deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Matiere.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Matiere.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };