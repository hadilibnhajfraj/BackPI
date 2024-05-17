const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Exercice = new Schema({
    description: String,
    dateLimite: Date,
    documents: [],
    typeExercice:String,
    id_cours: { type: Schema.Types.ObjectId, ref: 'Cours'},
    id_user: { type: Schema.Types.ObjectId, ref: 'User'},
    id_classe: { type: Schema.Types.ObjectId, ref: 'Classes' }
  
});

module.exports = mongoose.model("exercice", Exercice);

