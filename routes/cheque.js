const express = require("express");
const router = express.Router();
const chequecontroller = require("../controller/chequecontroller");

// Route pour ajouter un chèque
router.post("/:factureId/addcheque", chequecontroller.addCheque);

// Route pour afficher tous les chèques
router.get("/show", chequecontroller.show);



// Route pour mettre à jour un chèque
router.put("/update/:id", chequecontroller.update);

// Route pour supprimer un chèque
router.delete("/delete/:id", chequecontroller.deletecheque);

// Route pour vérifier les échéances des chèques
router.get("/checkecheance", chequecontroller.checkChequeEcheance);

router.get("/show/nonpaid", chequecontroller.showNonPaidCheques);

router.get("/factures/:factureId/montantRestant", chequecontroller.getMontantRestant);
router.get("/:id", chequecontroller.getById);

module.exports = router;
