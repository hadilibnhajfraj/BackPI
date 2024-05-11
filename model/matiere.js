const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Matiere = new Schema({
    nom: String,
    description: String,
    enseignant: { type: Schema.Types.ObjectId, ref: 'Enseignant' }
});

module.exports = mongoose.model("matiere", Matiere);
