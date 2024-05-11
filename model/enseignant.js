const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Enseignant = new Schema({
    nom: String,
    prenom: String,
    date_de_naissance: Date,
    adresse: String,
    email: String,
    telephone: String,
    experience: Number,
    id_user: { type: Schema.Types.ObjectId, ref: 'User' }   

});

module.exports = mongoose.model("enseignant", Enseignant);
