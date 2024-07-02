const express = require("express");
const router = express.Router();
const fraiscontroller = require("../controller/fraiscontroller");
//const validate = require("../middle/validate");
router.post("/addfrais",fraiscontroller.add);
router.get("/show", fraiscontroller.show);
router.get("/show/:id", fraiscontroller.get);
router.put("/update/:id", fraiscontroller.update);
router.delete("/delete/:id", fraiscontroller.deletefrais);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});
module.exports = router;