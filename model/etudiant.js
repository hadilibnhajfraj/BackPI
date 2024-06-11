const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Etudiant = new Schema({
    nom: String,
    prenom: String,
    date_de_naissance: Date,
    adresse: String,
    niveau: String,
    situation_familiale: String,
    id_user: { type: Schema.Types.ObjectId, ref: 'User' },
    email:{ type: String , required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Classe' , required: true },
});

module.exports = mongoose.model("etudiant", Etudiant);