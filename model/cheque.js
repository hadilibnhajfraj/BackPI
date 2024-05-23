const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChequeSchema = new Schema({
  reference: Number,
  proprietaire: String,
  montant: Number,
  echeance: String,
  statut: {
    type: String,
    default: "en cours"
  },
  paiement: {
    type: String,
    default: "non"
  },
  factureId: {
    type: Schema.Types.ObjectId,
    ref: 'Facture'
  }
});

module.exports = mongoose.model("Cheque", ChequeSchema);
