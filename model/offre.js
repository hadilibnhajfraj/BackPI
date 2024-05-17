const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OffreSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  remise: {
    type: Number,
    required: true
  },
  frais: [{
    type: Schema.Types.ObjectId,
    ref: 'Frais',
    required: true
  }],
  montant: {
    type: Number,
    required: true
  },
  montantApresRemise: {
    type: Number,
    required: true
  },
  detailsFrais: [{ // Liste des détails des frais
    _id: Schema.Types.ObjectId,
    nom: String,
    prix: Number // Ajout du champ prix
  }]
});

OffreSchema.pre('validate', async function(next) {
  try {
    if (!this.frais || this.frais.length === 0) {
      throw new Error("Au moins un frais doit être sélectionné.");
    }

    // Récupérer les détails complets des frais
    const Frais = mongoose.model('Frais');
    const fraisDetails = await Frais.find({ _id: { $in: this.frais } });

    // Remplacer les identifiants des frais par les détails complets
    this.detailsFrais = fraisDetails.map(frais => ({
      _id: frais._id,
      nom: frais.nom,
      prix: frais.prix // Ajout du prix de chaque frais
    }));

    // Calculer le montant total des frais sélectionnés
    let montantTotal = fraisDetails.reduce((total, frais) => total + frais.prix, 0);

    // Calculer le montant après remise
    this.montant = montantTotal;
    this.montantApresRemise = montantTotal * (1 - this.remise / 100);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Offre', OffreSchema);
