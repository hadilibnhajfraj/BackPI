const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/usercontroller");
//const validate = require("../middle/validate");
router.post("/add",usercontroller.add);
router.get("/show", usercontroller.show);
router.put("/update/:id", usercontroller.update);
router.delete("/delete/:id", usercontroller.deleteuser);
router.get("/chat", (req, res, next) => {
  res.render("chat");
});
module.exports = router;