const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cours = new Schema({
    nom: String,
    horaire: String,
    descriptionContenu: String,
    planCours: String,
    documents: [{ type: String }],
    id_user: { type: Schema.Types.ObjectId, ref: 'User'},
    id_matiere: { type: Schema.Types.ObjectId, ref: 'Matiere'},
    id_classe: { type: Schema.Types.ObjectId, ref: 'Classe' },
});

module.exports = mongoose.model("cours", Cours);