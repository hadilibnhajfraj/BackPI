const Banque = require("../model/banque");
const { updateChequePaiementStatus, updateChequeStatusToNon } = require("../controller/chequecontroller");
const sendEmail = require('../model/mailer');
const User = require('../model/user');
const Offre = require('../model/offre');
const Cheque = require("../model/cheque");

async function add(req, res, next) {
  try {
    const chequeId = req.params.chequeId;

    if (!chequeId) {
      return res.status(400).json("L'ID du chèque est requis");
    }

    const existingBanque = await Banque.findOne({ chequeId });
    if (existingBanque) {
      return res.status(400).json("L'ID du chèque existe déjà dans la base de données");
    }

    const banque = new Banque({ chequeId });
    await banque.save();

    await updateChequePaiementStatus(chequeId);

    const cheque = await Cheque.findById(chequeId).populate('factureId');
    if (!cheque) {
      return res.status(404).json("Chèque non trouvé");
    }

    const facture = cheque.factureId;
    if (!facture) {
      return res.status(404).json("Facture non trouvée");
    }

    const offre = await Offre.findById(facture.offreId);
    if (!offre) {
      return res.status(404).json("Offre non trouvée");
    }

    const user = await User.findById(offre.userId);
    if (!user) {
      return res.status(404).json("Utilisateur non trouvé");
    }

    await sendEmail(
      user.email,
      'Encaissement du chèque',
      `Bonjour ${user.firstName} ${user.lastName},\n\nVotre chèque pour l'offre ${offre.nom} a été encaissé dans la banque.\n\nMerci.`
    );

    res.status(201).json("Banque ajoutée avec succès et email envoyé");
  } catch (err) {
    console.log(err);
    res.status(500).json("Erreur lors de l'ajout de la banque");
  }
}

async function show(req, res, next) {
  try {
    const data = await Banque.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des banques");
  }
}

async function update(req, res, next) {
  try {
    await Banque.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
    res.status(500).json("Erreur lors de la mise à jour de la banque");
  }
}

async function deletebanque(req, res, next) {
  try {
    const banque = await Banque.findById(req.params.id);
    if (!banque) {
      return res.status(404).send("Banque non trouvée");
    }

    const chequeId = banque.chequeId;

    await Banque.findByIdAndDelete(req.params.id);

    await updateChequeStatusToNon(chequeId);

    res.send("deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la suppression de la banque");
  }
}

module.exports = { add, show, update, deletebanque };
