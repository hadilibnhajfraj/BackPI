const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FactureSchema = new Schema({
  reference: {
    type: String,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  montantApresRemise: {
    type: Number,
    required: true
  },
  montantCheque: {
    type: Number,
    default: 0
  },
  montantRestant: {
    type: Number,
    default: function() {
      return this.montantApresRemise;
    }
  },
  statut: {
    type: String,
    default: "encours"
  },
  client: String,
  offreId: {
    type: Schema.Types.ObjectId,
    ref: 'Offre'
  },
  nomOffre: {
    type: String
  },
  frais: [{
    nom: String,
    prix: Number
  }],
  userName: {
    type: String
  }
});

FactureSchema.pre('validate', async function(next) {
  if (!this.isNew) {
    return next(); // Ne rien faire si la facture n'est pas nouvellement créée
  }

  try {
    let count = 1;
    let referenceExists = true;

    while (referenceExists) {
      const reference = `FAC-EDUKIDS-${count}`;
      const existingFacture = await this.constructor.findOne({ reference });

      if (!existingFacture) {
        this.reference = reference;
        referenceExists = false;
      } else {
        count++;
      }
    }

    if (this.offreId) {
      const Offre = mongoose.model('Offre');
      const offre = await Offre.findById(this.offreId).populate('frais');

      if (offre) {
        this.nomOffre = offre.nom;
        this.montantApresRemise = offre.montantApresRemise;
        this.frais = offre.detailsFrais.map(frais => ({ nom: frais.nom, prix: frais.prix }));

        this.userName = offre.userName;
      } else {
        return next(new Error("L'offre spécifiée n'existe pas."));
      }
    } else {
      return next(new Error("L'offre est requise pour créer une facture."));
    }

    next();
  } catch (error) {
    next(error);
  }
});

FactureSchema.pre('save', function(next) {
  this.montantRestant = this.montantApresRemise - this.montantCheque;
  if (this.montantRestant <= 0) {
    this.statut = 'soldé';
  }
  next();
});

module.exports = mongoose.model('Facture', FactureSchema);
