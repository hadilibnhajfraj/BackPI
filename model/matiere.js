const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Matiere = new Schema({
    nom: { type: String, required: true }, // Name of the subject, required
    description:  String,
    enseignant: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }], // Teachers teaching the subject, required
    level: { type: String, required: true }, // Level of the subject, required
    nbr_heures: { type: Number, required: true }, // Number of hours allocated for the subject, required
    matriels: String // Materials related to the subject
});

module.exports = mongoose.model("Matiere", Matiere);
