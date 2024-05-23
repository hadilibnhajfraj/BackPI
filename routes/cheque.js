const express = require("express");
const router = express.Router();
const chequecontroller = require("../controller/chequecontroller");

// Route pour ajouter un chèque
router.post("/addcheque", chequecontroller.addCheque);

// Route pour afficher tous les chèques
router.get("/show", chequecontroller.show);

// Route pour mettre à jour un chèque
router.put("/update/:id", chequecontroller.update);

// Route pour supprimer un chèque
router.delete("/delete/:id", chequecontroller.deletecheque);

// Route pour vérifier les échéances des chèques
router.get("/checkecheance", chequecontroller.checkChequeEcheance);

module.exports = router;
