// models/cours.js
const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    horaire: { type: String, required: true },
    descriptionContenu: { type: String, required: true },
    planCours: { type: String, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classe: { type: String, required: true },
    matiere: { type: String, required: true },
    documents: { type: [String], required: true }
});

const Cours = mongoose.model('Cours', CoursSchema);

module.exports = Cours;
