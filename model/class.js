const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Classe = new Schema({
    name: { type: String, required: true }, // Name of the class, required
    level: { 
        type: String, 
        required: true,
        enum: [
            '1ere jardin d\'enfant', 
            '2eme jardin d\'enfant', 
            '3eme jardin d\'enfant', 
            '1ere année primaire', 
            '2eme année primaire', 
            '3eme année primaire', 
            '4eme année primaire', 
            '5eme année primaire', 
            '6eme année primaire'
        ] 
    },
    teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Teachers assigned to the class
    students: [{ type: Schema.Types.ObjectId, ref: 'Eleve'}], // Students in the class, required
    courses: [{ type: Schema.Types.ObjectId, ref: 'cours' }], // Courses associated with the class
    emploies:[{ type: Schema.Types.ObjectId, ref: 'emploi' }]
});

module.exports = mongoose.model("Classe", Classe);
