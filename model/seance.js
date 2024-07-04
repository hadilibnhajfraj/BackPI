const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Seance = new Schema({
    num_seance: { type: Number, required: true }, 
    emploie: { type: Schema.Types.ObjectId, ref: 'Emploi', required: true },
    heure_debut: { type: Number, required: true },
    heure_fin: { type: Number, required: true },
    matiere: { type: Schema.Types.ObjectId, ref: 'Matiere', required: true },
    salle: { type: Schema.Types.ObjectId, ref: 'Salle', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Classe', required: true },
    enseignant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true } // New date field
});

module.exports = mongoose.model('Seance', Seance);
