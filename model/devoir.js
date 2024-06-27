// models/devoir.js
const mongoose = require('mongoose');

const DevoirSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    documents: { type: [String], required: true },
    etudiant: { type: String, required: true },
    matiere: { type: String, required: true },
    classe: { type: String, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Devoir = mongoose.model('Devoir', DevoirSchema);

module.exports = Devoir;
