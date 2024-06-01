const express = require("express");
const router = express.Router();
const banquecontroller = require("../controller/banquecontroller");

router.post("/add/:chequeId", banquecontroller.add);
router.get("/show", banquecontroller.show);
router.put("/update/:id", banquecontroller.update);
router.delete("/delete/:id", banquecontroller.deletebanque);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});

module.exports = router;
