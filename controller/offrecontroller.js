const Offre = require('../model/offre');
const Frais = require('../model/frais');

async function add(req, res, next) {
  try {
    const offreData = req.body;
    const fraisIds = offreData.frais;

    // Vérifier si les frais existent
    const fraisExistants = await Frais.find({ _id: { $in: fraisIds } });
    if (fraisExistants.length !== fraisIds.length) {
      return res.status(400).send("Certains frais sélectionnés n'existent pas.");
    }

    // Calculer le montant total des frais sélectionnés
    let montantTotal = fraisExistants.reduce((total, frais) => total + frais.prix, 0);

    // Ajouter les montants calculés à l'offre
    offreData.montant = montantTotal;
    offreData.montantApresRemise = montantTotal * (1 - offreData.remise / 100);

    // Créer et sauvegarder l'offre
    const offre = new Offre(offreData);
    await offre.save();
    res.send("Offre ajoutée avec succès");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de l'ajout de l'offre");
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

module.exports = { add, show, update, deleteoffre };
