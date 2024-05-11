const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Etudiant = new Schema({
    nom: String,
    prenom: String,
    date_de_naissance: Date,
    adresse: String,
    niveau: String,
    situation_familiale: String,
    id_parent: { type: Schema.Types.ObjectId, ref: 'Parent' },

});

module.exports = mongoose.model("etudiant", Etudiant);
