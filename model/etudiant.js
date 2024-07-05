const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Etudiant = new Schema({
    firstName: String,
    lastName: String,
    date_de_naissance: Date,
    adresse: String,
    niveau: String,
    situation_familiale: String,
    id_user: { type: Schema.Types.ObjectId, ref: 'User' },
    activated: { type: Boolean, default: false },
    email:{ type: String , required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Classe' , required: true },

});

module.exports = mongoose.model("Etudiant", Etudiant);