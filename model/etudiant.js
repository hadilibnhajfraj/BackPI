const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Etudiant = new Schema({
    nom: { type: String, required: true }, // Student's last name, required
    prenom: { type: String, required: true }, // Student's first name, required
    date_de_naissance: { type: Date, required: true }, // Student's date of birth, required
    adresse: { type: String, required: true }, // Student's address, required
    niveau: { type: String, required: true }, // Student's level, required
    situation_familiale: String, // Student's family situation
    id_parent: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to parent, required
});

module.exports = mongoose.model("Etudiant", Etudiant);
