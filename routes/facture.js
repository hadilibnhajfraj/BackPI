const express = require("express");
const router = express.Router();
const facturecontroller = require("../controller/facturecontroller");
//const validate = require("../middle/validate");
router.post("/addfacture",facturecontroller.addFacture);
router.get("/show", facturecontroller.show);
router.put("/update/:id", facturecontroller.update);
router.delete("/delete/:id", facturecontroller.deletefacture);
router.get('/generatePdf/:id', facturecontroller.generatePdf);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});
module.exports = router;