const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stations = [
  "Centre Ville",
  "Aouina",
  "Le Kram",
  "Omran",
  "La goulette",
  "La marsa",
  "Lac 1",
  "Lac 2",
];

const busSchema = new Schema({
  itineraire: {
    type: {
      depart: {
        type: String,
        required: true,
        enum: stations,
      },
      arrivee: {
        type: String,
        required: true,
        enum: stations,
      },
    },
    required: true,
  },
  horaire: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid time format! Use HH:MM format.`,
    },
  },
  matricule: { type: String, required: true, unique: true },
  chauffeur: { type: Schema.Types.ObjectId, ref: "Chauffeur" },
});

module.exports = mongoose.model("Bus", busSchema);
