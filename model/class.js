const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Classe = new Schema({
    name: { type: String, required: true }, // Name of the class, required
    level: { type: String, required: true }, // Level of the class, required
    teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Teachers assigned to the class
    students: [{ type: Schema.Types.ObjectId, ref: 'etudiant'}], // Students in the class, required
    courses: [{ type: Schema.Types.ObjectId, ref: 'cours' }], // Courses associated with the class
    emploies:[{ type: Schema.Types.ObjectId, ref: 'emploi' }]
});

module.exports = mongoose.model("Classe", Classe);
