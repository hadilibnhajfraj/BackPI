const Etudiant = require ("../model/Etudiant");

async function add(req, res, next){
    try{
        const etudiant = new Etudiant(req.body);
        await etudiant.save();
        
        res.status(200).send ("Etudiant add");
    }catch(err){
        console.log (err);
    }
}

module.exports = { add };