const express = require("express");
const router = express.Router();
const facturecontroller = require("../controller/facturecontroller");
//const validate = require("../middle/validate");

// Routes pour les factures
router.post("/addfacture", facturecontroller.addFacture);
router.get("/show", facturecontroller.show);
router.get("/show/:id", facturecontroller.get);
router.put("/update/:id", facturecontroller.update);
router.delete("/delete/:id", facturecontroller.deletefacture);
router.get('/generatePdf/:id', facturecontroller.generatePdf);
router.get('/search', facturecontroller.searchFactures);
router.get('/searchStatut', facturecontroller.searchFacturesByStatut);



// Nouvelle route pour récupérer les informations des paiements par chèque pour chaque facture
router.get('/:id/cheques', facturecontroller.getChequesForFacture);
router.get('/generateQrCode/:id', facturecontroller.generateQrCode);


// Exemple d'autre route
router.get("/chat", (req, res, next) => {
  res.render("chat");
});

module.exports = router;
