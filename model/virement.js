const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Fonction pour générer une référence de virement aléatoire
function generateReference() {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Génère un nombre aléatoire entre 10000000 et 99999999
  return 'VIR-' + randomNumber.toString().substring(0, 8); // Utilise les 8 premiers chiffres du nombre aléatoire comme référence
}

const VirementSchema = new Schema({
  referenceVirement: {
    type: String,
    required: true,
    unique: true
  },
  factureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facture',
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Hook pour générer automatiquement la référence de virement avant la validation
VirementSchema.pre('validate', function(next) {
  if (!this.referenceVirement) {
    this.referenceVirement = generateReference();
  }
  next();
});

module.exports = mongoose.model("Virement", VirementSchema);
