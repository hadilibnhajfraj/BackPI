const mongoose = require("mongoose");
const { date } = require("yup");
const Schema = mongoose.Schema;

const Emploi = new Schema({
    year: { type: Number, required: true }, // Year, required
    class: { type: Schema.Types.ObjectId, ref: 'Classe' , required: true},
    seances: [{ type: Schema.Types.ObjectId, ref: 'Seance' }],
    file: { type: String },
    date_debut: { type: Date, required: true }, // File path, required
    date_fin: { type: Date, required: true }
});



module.exports = mongoose.model("Emploi", Emploi);
