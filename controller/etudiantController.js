const Etudiant = require ("../model/etudiant");

async function add(req, res, next){
    try{
        const etudiant = new Etudiant(req.body);
        await etudiant.save();
        
        res.status(200).send ("Etudiant add");
    }catch(err){
        console.log (err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Etudiant.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Etudiant.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Etudiant updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Etudiant.findByIdAndDelete(req.params.id);
        res.status(200).send("Etudiant deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Etudiant.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Etudiant.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };