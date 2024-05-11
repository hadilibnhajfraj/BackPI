const Enseignant = require ("../model/enseignant");

async function add(req, res, next){
    try{
        const enseignant = new Enseignant(req.body);
        await enseignant.save();
        res.status(200).send ("Enseignant add");
    }catch(err){
        console.log (err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Enseignant.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Enseignant.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Enseignant updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Enseignant.findByIdAndDelete(req.params.id);
        res.status(200).send("Enseignant deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Enseignant.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Enseignant.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };