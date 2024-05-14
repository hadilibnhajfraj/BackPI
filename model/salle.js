const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Salle = new Schema({
    name: { type: String, required: true }, // Name of the room, required
    capacity: { type: Number, required: true }, // Capacity of the room, required
    location: String, // Location of the room
    speciality: { type: String, required: true } // Speciality of the room, required
});

module.exports = mongoose.model("Salle", Salle);
