const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Activites = new Schema({
  nom: String,
  localisation: {
    type: String,
    enum: ["interieur", "exterieur"],
  },
  date_act: Date,
  description: String,
  local: String,
  nblimite: Number,
  galerie: [
    {
      data: Buffer, // Données de l'image
      contentType: String, // Type de contenu de l'image
    },
  ],
  temperature: String, // Add this line for temperature
});

module.exports = mongoose.model("Activites", Activites);
