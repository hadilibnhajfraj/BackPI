const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Classe = new Schema({
    name: { type: String, required: true }, // Name of the class, required
    level: { type: String, required: true }, // Level of the class, required
    teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Teachers assigned to the class
    students: [{ type: Schema.Types.ObjectId, ref: 'Etudiant', required: true }], // Students in the class, required
    courses: [{ type: Schema.Types.ObjectId, ref: 'Cours' }] // Courses associated with the class
});

module.exports = mongoose.model("Classe", Classe);
