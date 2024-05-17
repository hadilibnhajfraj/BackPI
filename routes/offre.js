const express = require("express");
const router = express.Router();
const offrecontroller = require("../controller/offrecontroller");

router.post("/addoffre", offrecontroller.add);
router.get("/show", offrecontroller.show);
router.put("/update/:id", offrecontroller.update);
router.delete("/delete/:id", offrecontroller.deleteoffre);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});
module.exports = router;