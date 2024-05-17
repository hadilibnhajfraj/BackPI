const Cheque = require("../model/cheque");
const Facture = require("../model/facture");

async function addCheque(req, res, next) {
  try {
    const { factureId, montant } = req.body;

    const facture = await Facture.findById(factureId);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    // Vérification du statut de la facture
    if (facture.statut === "soldé") {
      return res.status(400).send("Facture déjà soldée, merci de vérifier la facture");
    }

    // Vérification du montant du chèque par rapport au reste de la facture
    const reste = facture.montantApresRemise - (facture.montantCheque || 0);
    if (montant > reste) {
      return res.status(400).send("Le montant du chèque dépasse le reste de la facture");
    }

    // Ajout du chèque
    const cheque = new Cheque(req.body);
    await cheque.save();

    facture.montantCheque = (facture.montantCheque || 0) + montant;

    // Mise à jour du statut si le reste est 0
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
    const data = await Cheque.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Cheque.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deletecheque(req, res, next) {
  try {
    await Cheque.findByIdAndDelete(req.params.id);
    res.send("deleted");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { addCheque, show, update, deletecheque };
