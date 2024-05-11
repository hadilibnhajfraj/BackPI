const Activite = require ("../model/activite");

async function add(req, res, next){
    try{
        const activite = new Activite(req.body);
        await activite.save();
        res.status(200).send ("Activite add");
    }catch(err){
        console.log (err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Activite.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Activite.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Activite updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Activite.findByIdAndDelete(req.params.id);
        res.status(200).send("Activite deleted")
    } catch (err) {
        console.log(err)
    }
};


async function findByEnseignant(req, res, next) {
    try {
        // Récupérez l'ID de l'enseignant à partir des paramètres de la requête
        const idEnseignant = req.params.idEnseignant;

        // Recherchez toutes les activités avec l'ID de l'enseignant spécifié
        const activites = await Activite.find({ id_enseignant: idEnseignant });

        // Renvoyez les activités trouvées en réponse
        res.status(200).json(activites);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la recherche des activités.");
    }
}

async function allbyId(req, res, next) {
    try {
        const data = await Activite.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Activite.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone, findByEnseignant };