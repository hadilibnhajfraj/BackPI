const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FraisSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Frais", FraisSchema);
