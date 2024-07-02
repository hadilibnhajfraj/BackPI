const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Salle = new Schema({
    name: { type: String, required: true }, // Nom de la salle, requis
    capacity: { type: Number, required: true }, // Capacité de la salle, requis
    location: { 
        type: String, 
        required: true, 
        enum: ['Rez-de-chaussée', '1er étage', '2ème étage', '3ème étage']  // Enum pour location avec trois valeurs possibles
    }
});

module.exports = mongoose.model("Salle", Salle);
