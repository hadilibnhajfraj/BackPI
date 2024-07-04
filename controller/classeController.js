
const Classe = require ("../model/classes");

async function add(req, res, next){
    try{
        const classe = new Classe(req.body);
        await classe.save();
        res.status(200).send ("Classe add");
    }catch(err){
        console.log (err);
    }
}

async function show(req, res, next) {
    try {
        const data = await Classe.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Classe.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Classe updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Classe.findByIdAndDelete(req.params.id);
        res.status(200).send("Classe deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Classe.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Classe.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};
async function showClass(req, res, next) {
  try {
    const data = await Classe.find()
      .populate({
        path: 'teachers',
        model: Enseignant,
        select: 'firstName lastName'
      })
      .populate({
        path: 'students',
        model: Etudiant,
        select: 'prenom nom'
      }).populate({
        path: 'courses',
        model: Cours,
        select: 'nom'
      }).populate({
        path: 'emploies',
        model: Emploi,
        select: 'file'
      });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send('Erreur serveur');
  }
}

module.exports = { add, show, updated, deleted, allbyId, showByone , showClass };



