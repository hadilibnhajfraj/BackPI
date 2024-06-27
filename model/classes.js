const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Classe = new Schema({
    nom: String,
});

module.exports = mongoose.model("classe", Classe);
