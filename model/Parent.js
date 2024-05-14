const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Parent = new Schema({
    nom: String,
    prenom: String,
    adresse: String,
    email: String,
    telephone: String,
    //id_user: { type: Schema.Types.ObjectId, ref: 'User' }

});

module.exports = mongoose.model("parent", Parent);