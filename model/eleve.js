const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EtudiantSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    date_de_naissance: { type: Date, required: true },
    adresse: { type: String, required: true },
    niveau: { type: String, required: true },
    situation_familiale: {
        type: String,
        enum: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf/Veuve"],
        default: "Célibataire"
    },
    image: { type: [String], required: true },
    id_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classe: { type: Schema.Types.ObjectId, ref: 'Classe', required: true },
});

module.exports = mongoose.model("Eleve", EtudiantSchema);
