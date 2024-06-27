const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    description: { type: String, required: true },
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    repas: { type: String, enum: ['Petit-déjeuner', 'Déjeuner', 'Dîner'], required: true },
    etudiant: {
        _id: mongoose.Schema.Types.ObjectId,
        nom: { type: String, required: true },
        prenom: { type: String, required: true } // Corrected typo here
    },
    humeur: { type: String, enum: ['happy', 'sad', 'neutral'], required: true },
    sante: { type: String, enum: ['good', 'bad', 'average'], required: true },
    communication: { type: String, enum: ['excellent', 'poor', 'average'], required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Observation = mongoose.model('Observation', observationSchema);

module.exports = Observation;
