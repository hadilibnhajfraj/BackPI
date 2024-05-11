const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cours = new Schema({
    nom: String,
    horaire: String,
    descriptionContenu: String,
    planCours: String,
    documents: [] ,
    id_enseignant: { type: Schema.Types.ObjectId, ref: 'Enseignant' },
    id_classe: { type: Schema.Types.ObjectId, ref: 'Classe' },
});

module.exports = mongoose.model("cours", Cours);
