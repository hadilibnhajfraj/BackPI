const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
router.post("/add", userController.add);
router.get("/show", userController.show);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.deleted);
module.exports = router;
