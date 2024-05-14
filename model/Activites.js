const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Activites = new Schema({
  nom: String,
  localisation: {
    type: String,
    enum: ["interieur", "exterieur"],
    required: true,
  },
  date_act: Date,
  description: String,
  local: String,
  nblimite:String,
  galerie: [
    {
      data: Buffer, // Données de l'image
      contentType: String, // Type de contenu de l'image
    },
  ],
});

module.exports = mongoose.model("Activites", Activites);
