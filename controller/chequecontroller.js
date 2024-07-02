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
    const chequeId = req.params.id;
    const updatedCheque = req.body;

    const cheque = await Cheque.findById(chequeId);
    if (!cheque) {
      return res.status(404).send("Chèque non trouvé");
    }

    // Ancien montant du chèque
    const oldMontant = cheque.montant;

    // Mettre à jour le chèque avec les nouvelles données
    await Cheque.findByIdAndUpdate(chequeId, updatedCheque);

    // Nouveau montant du chèque
    const newMontant = updatedCheque.montant;

    // Calculer la différence de montant
    const differenceMontant = newMontant - oldMontant;

    // Mettre à jour le montant restant de la facture associée
    const facture = await Facture.findById(cheque.factureId);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    facture.montantCheque = (facture.montantCheque || 0) + differenceMontant;

    if (facture.montantApresRemise - facture.montantCheque === 0) {
      facture.statut = "soldé";
    } else {
      facture.statut = "non soldé";
    }

    // Sauvegarder la facture mise à jour
    await facture.save();

    res.json("Chèque mis à jour avec succès");
  } catch (err) {
    console.error(err);
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

async function getMontantRestant(req, res, next) {
  try {
    const factureId = req.params.factureId;
    const facture = await Facture.findById(factureId);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    const montantRestant = facture.montantApresRemise - (facture.montantCheque || 0);
    res.json({ montantRestant }); // Assurez-vous que cela renvoie un objet avec "montantRestant"
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération du montant restant de la facture");
  }
}

async function getById(req, res, next) {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).send("Chèque non trouvé");
    }
    res.json(cheque);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération du chèque");
  }
}

module.exports = { addCheque, show, update, deletecheque, checkChequeEcheance, updateChequePaiementStatus, updateChequeStatusToNon,
   showNonPaidCheques, getMontantRestant, getById };
