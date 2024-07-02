const express = require("express");
const router = express.Router();
const emploieEnseignantController = require("../controller/emploieEnseignantController");
router.post("/add", emploieEnseignantController.add);
router.get("/show", emploieEnseignantController.show);
router.put("/update/:id", emploieEnseignantController.updated);
router.delete("/delete/:id", emploieEnseignantController.deleted);
router.get("/show/:id", emploieEnseignantController.showById);
module.exports = router;
