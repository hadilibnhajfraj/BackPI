const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Exercice = new Schema({
    description: String,
    dateLimite: Date,
    documents: [],
    typeExercice:String,
    cours: { type: String, required: true },
    id_user: { type: Schema.Types.ObjectId, ref: 'User'},
  
});

module.exports = mongoose.model("exercice", Exercice);

