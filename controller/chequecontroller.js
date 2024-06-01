const Cheque = require("../model/cheque");
const Facture = require("../model/facture");
const Banque = require("../model/banque");
const moment = require('moment');

async function addCheque(req, res, next) {
  try {
    const { montant } = req.body;
    const factureId = req.params.factureId;

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

    const cheque = new Cheque({ ...req.body, factureId });
    cheque.paiement = "non";
    await cheque.save();

    facture.montantCheque = (facture.montantCheque || 0) + montant;

    if (facture.montantApresRemise - facture.montantCheque === 0) {
      facture.statut = "soldé";
    }

    await facture.save();

    res.json("Chèque ajouté");
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
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).send("Chèque non trouvé");
    }

    const factureId = cheque.factureId;
    const montant = cheque.montant;

    await Cheque.findByIdAndDelete(req.params.id);

    const facture = await Facture.findById(factureId);
    if (facture) {
      facture.montantCheque = (facture.montantCheque || 0) - montant;

      if (facture.montantApresRemise - facture.montantCheque !== 0) {
        facture.statut = "non soldé";
      }

      await facture.save();
    }

    await updateChequePaiementStatus(req.params.id);

    res.json("Chèque supprimé");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la suppression du chèque");
  }
}

async function checkChequeEcheance(req, res, next) {
  try {
    const cheques = await Cheque.find();
    const today = moment();
    let countChequesDue = 0;

    cheques.forEach(cheque => {
      const echeanceDate = moment(cheque.echeance);
      if (today.isAfter(echeanceDate)) {
        countChequesDue++;
      }
    });

    const totalCheques = cheques.length;
    const percentageDue = (countChequesDue / totalCheques) * 100;

    res.json({
      totalCheques: totalCheques,
      chequesDue: countChequesDue,
      percentageDue: percentageDue.toFixed(2) + "%"
    });
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
  }
}

async function updateChequeStatusToNon(chequeId) {
  try {
    await Cheque.findByIdAndUpdate(chequeId, { paiement: "non" });
  } catch (err) {
    console.log(err);
  }
}

async function showNonPaidCheques(req, res, next) {
  try {
    const nonPaidCheques = await Cheque.find({ paiement: "non" });
    res.json(nonPaidCheques);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des chèques impayés");
  }
}

module.exports = { addCheque, show, update, deletecheque, checkChequeEcheance, updateChequePaiementStatus, updateChequeStatusToNon, showNonPaidCheques };
