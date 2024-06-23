const express = require("express");
const router = express.Router();
const multer = require("multer");
const activiteController = require("../controller/activiteController");
const { uploadImages } = require("../controller/activiteController");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Activites = require("../model/Activites");
router.post("/add", activiteController.add);
router.get("/getActivite", activiteController.show);
router.put("/updatetActivite/:id", activiteController.updateActivite);
router.delete("/deleteActivite/:id", activiteController.deleteActivites);
router.get("/getActiviteId/:id", activiteController.getActiviteId);
router.post('/uploadImages/:id', upload.array('galerie', 5), async (req, res) => {
    try {
      const images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
  
      const activite = await Activites.findById(req.params.id);
      if (!activite) {
        return res.status(404).json('Activité non trouvée');
      }
  
      activite.galerie.push(...images);
      await activite.save();
  
      res.json('Images téléchargées avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement des images :', error);
      res.status(500).json('Erreur serveur');
    }
  });
  
module.exports = router;
