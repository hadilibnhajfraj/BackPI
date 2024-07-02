const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OffreSchema = new Schema({
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
    prix: Number // Ajout du prix de chaque frais
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { // Nom de l'utilisateur associé
    type: String,
    required: true
  }
});

OffreSchema.pre('validate', async function(next) {
  try {
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

    // Calculer la remise en fonction du nombre de frais
    let remise = 0;
    const fraisCount = this.frais.length;

    if (fraisCount === 3) {
      remise = 15;
    } else if (fraisCount === 4) {
      remise = 20;
    } else if (fraisCount > 4) {
      remise = 25;
    }

    this.remise = remise;

    // Calculer le montant après remise
    this.montant = montantTotal;  
    this.montantApresRemise = montantTotal * (1 - remise / 100);

    // Récupérer l'utilisateur associé et ajouter son nom
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    this.userName = `${user.firstName} ${user.lastName}`;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Offre', OffreSchema);