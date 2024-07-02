const mongoose = require("mongoose");
const { date } = require("yup");
const Schema = mongoose.Schema;

const EmploiEnseignant = new Schema({
    year: { type: Number, required: true }, // Year, required
    seances: [{ type: Schema.Types.ObjectId, ref: 'Seance' }],
    file: { type: String },
    enseignant: { type: Schema.Types.ObjectId, ref: 'User',required : true },
    date_debut: { type: Date, required: true }, // File path, required
    date_fin: { type: Date, required: true }
});



module.exports = mongoose.model("EmploiEnseignant", EmploiEnseignant);
