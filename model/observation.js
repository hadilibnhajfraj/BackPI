const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RepasEnum = require("../enums/repasEnum");
const CommunicationEnum = require("../enums/communicationEnum");
const HumeurEnum = require("../enums/humeurEnum");
const SanteEnum = require("../enums/santeEnum");


const Observation = new Schema({
    description: String,
    date: Date,
    heure: Number,
    repas: { type: Number, enum: Object.values(RepasEnum) },
    humeur: { type: Number, enum: Object.values(HumeurEnum) },
    sante: { type: Number, enum: Object.values(SanteEnum) },
    communication: { type: Number, enum: Object.values(CommunicationEnum) },
    id_etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant'},
    id_user: { type: Schema.Types.ObjectId, ref: 'User' },


});

module.exports = mongoose.model("observation", Observation);
