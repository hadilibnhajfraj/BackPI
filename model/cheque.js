const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChequeSchema = new Schema({
  reference: Number,
  proprietaire: String,
  montant: Number,
  echeance: String,
  factureId: {
    type: Schema.Types.ObjectId,
    ref: 'Facture'
  }
});

module.exports = mongoose.model("Cheque", ChequeSchema);
