const Virement = require("../model/virement");
const Facture = require("../model/facture");

async function addVirement(req, res, next) {
  try {
    console.log("body :" + JSON.stringify(req.body));
    const { montant } = req.body;
    const factureId = req.body.factureId;

    const facture = await Facture.findById(factureId);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    if (facture.statut === "soldé") {
      return res.status(400).send("Facture déjà soldée, merci de vérifier la facture");
    }

    const nouveauMontantRestant = facture.montantRestant - montant;
    if (nouveauMontantRestant < 0) {
      return res.status(400).send("Le montant du virement dépasse le montant restant de la facture");
    }

    const virement = new Virement(req.body);
    await virement.save();

    facture.montantVirement += montant;
    facture.montantRestant = nouveauMontantRestant; // Mettre à jour montantRestant au lieu de montantApresRemise

    if (facture.montantRestant <= 0) {
      facture.statut = "soldé";
    }

    await facture.save();

    res.json("Virement ajouté et montant de la facture mis à jour");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de l'ajout du virement et de la mise à jour de la facture");
  }
}

async function showVirements(req, res, next) {
  try {
    const virements = await Virement.find().populate('factureId');
    res.status(200).json(virements);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

async function getVirement(req, res, next) {
  try {
    const virement = await Virement.findById(req.params.id).populate('factureId');
    if (!virement) {
      return res.status(404).send("Virement not found");
    }
    res.status(200).json(virement);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

async function updateVirement(req, res, next) {
  try {
    const virement = await Virement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!virement) {
      return res.status(404).send("Virement not found");
    }
    res.status(200).send("Virement updated");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

async function deleteVirement(req, res, next) {
  try {
    const virement = await Virement.findByIdAndDelete(req.params.id);
    if (!virement) {
      return res.status(404).send("Virement not found");
    }
    res.status(200).send("Virement deleted");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

module.exports = { addVirement, showVirements, getVirement, updateVirement, deleteVirement };
