const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reclamationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'Probleme de transport',
            'Probleme de repas',
            'Probleme activite',
            'Probleme concernant un etudiant',
            'Probleme concernant un enseignant',
            'Autres'
        ],
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    etat: {
        type: String,
        enum: ['lu', 'non lu', 'traite'],
        default: 'non lu'
    },
    responses: [{
        type: Schema.Types.ObjectId,
        ref: 'Response'
    }]
});

module.exports = mongoose.model("Reclamation", reclamationSchema);
