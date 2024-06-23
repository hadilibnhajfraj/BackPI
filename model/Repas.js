const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RepasSchema = new Schema({
  jour: {
    type: Date,
    required: true,
  },
  nomRepas: {
    type: String,
    required: true,
  },
  tempsRepas: {
    type: String,
    enum: ["petit dejeuner", "dejeuner", "diner"],
    required: true,
  },
  allergiesEleve: [
    {
      type: Schema.Types.ObjectId,
      ref: "alergie",
    },
  ],
  favori: {
    type: Boolean,
    default: false, // Par défaut, le repas n'est pas favori
  },
});

module.exports = mongoose.model("Repas", RepasSchema);
