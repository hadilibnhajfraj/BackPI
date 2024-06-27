const User = require ("../model/user.js");
const Parent = require ("../model/Parent.js");
async function add(req, res, next){
    try{
        const etudiant = new User(req.body);
        await etudiant.save();
        
        res.status(200).send ("User add");
    }catch(err){
        console.log (err);
    }
}
async function addParent(req, res, next){
    try{
        const parent = new Parent(req.body);
        await parent.save();
        
        res.status(200).send ("Parent add");
    }catch(err){
        console.log (err);
    }
}
module.exports = { add , addParent };