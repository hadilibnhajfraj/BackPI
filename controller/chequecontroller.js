const Cheque = require("../model/cheque");
const Facture = require("../model/facture");
const Banque = require("../model/banque");
const moment = require('moment');

async function addCheque(req, res, next) {
  try {
    const { factureId, montant } = req.body;

    const facture = await Facture.findById(factureId);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    if (facture.statut === "soldé") {
      return res.status(400).send("Facture déjà soldée, merci de vérifier la facture");
    }

    const reste = facture.montantApresRemise - (facture.montantCheque || 0);
    if (montant > reste) {
      return res.status(400).send("Le montant du chèque dépasse le reste de la facture");
    }

    const cheque = new Cheque(req.body);
    cheque.paiement = "non";
    await cheque.save();

    facture.montantCheque = (facture.montantCheque || 0) + montant;

    if (facture.montantApresRemise - facture.montantCheque === 0) {
      facture.statut = "soldé";
    }

    await facture.save();

    res.send("Chèque ajouté");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de l'ajout du chèque");
  }
}

async function show(req, res, next) {
  try {
    const cheques = await Cheque.find();
    res.json(cheques);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des chèques");
  }
}

async function update(req, res, next) {
  try {
    await Cheque.findByIdAndUpdate(req.params.id, req.body);

    await updateChequePaiementStatus(req.params.id);

    res.send("updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la mise à jour du chèque");
  }
}

async function deletecheque(req, res, next) {
  try {
    await Cheque.findByIdAndDelete(req.params.id);
    res.send("deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la suppression du chèque");
  }
}

async function checkChequeEcheance(req, res, next) {
  try {
    const cheques = await Cheque.find();
    const today = moment();

    const chequesWithStatus = cheques.map(cheque => {
      const echeanceDate = moment(cheque.echeance);
      if (today.isAfter(echeanceDate)) {
        cheque.statut = 'échu';
      } else {
        const joursRestants = echeanceDate.diff(today, 'days');
        cheque.statut = `Il reste ${joursRestants} jours`;
      }
      return cheque;
    });

    res.json(chequesWithStatus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la vérification des échéances des chèques");
  }
}

async function updateChequePaiementStatus(chequeId) {
  try {
    const chequeExistsInBanque = await Banque.findOne({ chequeId });
    if (chequeExistsInBanque) {
      await Cheque.findByIdAndUpdate(chequeId, { paiement: "oui" });
    } else {
      await Cheque.findByIdAndUpdate(chequeId, { paiement: "non" });
    }
  } catch (err) {
    console.log(err);
    // Gérer l'erreur selon les besoins
  }
}

module.exports = { addCheque, show, update, deletecheque, checkChequeEcheance, updateChequePaiementStatus };
