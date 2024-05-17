const express = require("express");
const router = express.Router();
const chequecontroller = require("../controller/chequecontroller");
//const validate = require("../middle/validate");
router.post("/addcheque",chequecontroller.addCheque);
router.get("/show", chequecontroller.show);
router.put("/update/:id", chequecontroller.update);
router.delete("/delete/:id", chequecontroller.deletecheque);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});
module.exports = router;