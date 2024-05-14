const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cours = new Schema({
    nom: { type: String, required: true }, // Name of the course, required
    horaire: { type: String, required: true }, // Schedule of the course, required
    descriptionContenu: String, // Description of the course content
    planCours: String, // Course plan
    documents: [{ type: String }], // Array of file paths for documents related to the course
    id_enseignant: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the teacher, required
    id_matiere: { type: Schema.Types.ObjectId, ref: 'Matiere', required: true }, // Reference to the subject, required
    id_classe: { type: Schema.Types.ObjectId, ref: 'Classe'}, // Reference to the class, required
});

module.exports = mongoose.model("Cours", Cours);
