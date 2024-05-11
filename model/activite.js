const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Activite = new Schema({
    nom: String,
    description: String,
    dateDebut: Date,
    dateFin: Date,
    duree: Number,
    lieu: String,
    objectifs: String,
    id_enseignant: { type: Schema.Types.ObjectId, ref: 'Enseignant'} ,
    id_classe: { type: Schema.Types.ObjectId, ref: 'Classes' }, 

});

module.exports = mongoose.model("activite", Activite);

