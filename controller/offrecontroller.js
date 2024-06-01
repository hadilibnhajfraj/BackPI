const Offre = require('../model/offre');
const Frais = require('../model/frais');
const mongoose = require('mongoose');

async function add(req, res, next) {
  try {
    const offreData = req.body;
    const fraisIds = offreData.frais;

    // Verify if the fees exist
    const fraisExistants = await Frais.find({ _id: { $in: fraisIds } });
    if (fraisExistants.length !== fraisIds.length) {
      return res.status(400).send("Certains frais sélectionnés n'existent pas.");
    }

    // Calculate the total amount of selected fees
    let montantTotal = fraisExistants.reduce((total, frais) => total + frais.prix, 0);

    // Add the calculated amounts to the offer
    offreData.montant = montantTotal;
    offreData.montantApresRemise = montantTotal * (1 - offreData.remise / 100);

    // Create and save the offer
    const offre = new Offre(offreData);
    const savedOffre = await offre.save();

    // Return the saved offer including the _id
    res.json(savedOffre); 
  } catch (err) {
    console.log(err);
    res.status(500).json("Erreur lors de l'ajout de l'offre");
  }
}


async function show(req, res, next) {
  try {
    const data = await Offre.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des offres");
  }
}

async function update(req, res, next) {
  try {
    const offreData = req.body;

    // Si les frais sont mis à jour, recalculer les montants
    if (offreData.frais) {
      const fraisIds = offreData.frais;
      const fraisExistants = await Frais.find({ _id: { $in: fraisIds } });
      if (fraisExistants.length !== fraisIds.length) {
        return res.status(400).send("Certains frais sélectionnés n'existent pas.");
      }

      let montantTotal = fraisExistants.reduce((total, frais) => total + frais.prix, 0);
      offreData.montant = montantTotal;
      offreData.montantApresRemise = montantTotal * (1 - offreData.remise / 100);
    }

    await Offre.findByIdAndUpdate(req.params.id, offreData);
    res.send("Offre mise à jour avec succès");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la mise à jour de l'offre");
  }
}

async function deleteoffre(req, res, next) {
  try {
    await Offre.findByIdAndDelete(req.params.id);
    res.send("Offre supprimée avec succès");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la suppression de l'offre");
  }
}

async function showById(req, res, next) {
  try {
    const offreId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(offreId)) {
      return res.status(400).send("Invalid Offre ID format");
    }
    const data = await Offre.findById(offreId).populate('frais');
    if (!data) {
      return res.status(404).send("Offre non trouvée");
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des détails de l'offre");
  }
}
async function getLatestOffreId(req, res, next) {
  try {
    // Recherchez la dernière offre ajoutée dans la base de données
    const latestOffre = await Offre.findOne().sort({ _id: -1 }).limit(1);

    if (!latestOffre) {
      return res.status(404).send("Aucune offre trouvée");
    }

    // Renvoyer l'ID de la dernière offre ajoutée
    res.json(latestOffre._id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de l'ID de la dernière offre ajoutée");
  }
}


module.exports = { add, show, update, deleteoffre, showById, getLatestOffreId};
