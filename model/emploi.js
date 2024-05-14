const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Emploi = new Schema({
    year: { type: Number, required: true }, // Year, required
    level: { type: String, required: true }, // Level, required
    classe: { type: Schema.Types.ObjectId, ref: 'Classe', required: true }, // Reference to class, required
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to teacher, required
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Salle', required: true }], // Array of room references, required
    file: { type: String, required: true }, // File path, required
});

module.exports = mongoose.model("Emploi", Emploi);
