const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Emploi = new Schema({
    year: { type: Number, required: true }, // Year, required
    seance: { type: Schema.Types.ObjectId, ref: 'Seance', required: true },
    file: { type: String, required: true }, // File path, required
});

module.exports = mongoose.model("Emploi", Emploi);
