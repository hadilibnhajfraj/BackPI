const express = require("express");
const router = express.Router();
const messagecontroller = require("../controller/mesageController.js");
router.post("/add", messagecontroller.add);
router.get("/showall", messagecontroller.show);
router.put("/update/:id", messagecontroller.update);
router.delete("/delete/:id", messagecontroller.deletemessage);
router.get("/conversation/:userId", messagecontroller.getUserConversations);
router.get("/conversation/:id1/:id2", messagecontroller.afficherConversation);
router.get("/active", messagecontroller.obtenirUtilisateursEtEtudiantsActives);
router.post(
  "/blocker/:blockerId/:blockedId",
  messagecontroller.bloquerUtilisateur
);
router.get("/notification/:id", messagecontroller.genererNotification);
router.get("/:id", messagecontroller.getMessage);
router.get("/count/:userId", messagecontroller.countNotif);
router.get("/notifications/:userId", messagecontroller.getNotification);
module.exports = router;
