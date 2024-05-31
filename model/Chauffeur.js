const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chauffeurSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: String, required: true ,unique: true },
  email: { type: String, required: true ,unique: true},
  disponibilite: { type: Boolean },
  
});

module.exports = mongoose.model("Chauffeur", chauffeurSchema);
