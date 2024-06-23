const Activites = require("../model/Activites");
const multer = require("multer");
const { getWeather } = require("./notificationController");

const storage = multer.memoryStorage(); // Stocke les images en mémoire sous forme de Buffer
const upload = multer({ storage: storage }).fields([
  { name: "galerie", maxCount: 5 },
]); // Supposons que vous pouvez télécharger jusqu'à 5 images pour la galerie

async function add(req, res, next) {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Erreur Multer :", err);
        return res.status(500).json("Erreur Multer");
      }
      if (!req.files || !req.files["galerie"]) {
        console.log("Aucune image téléchargée pour la galerie");
        return res
          .status(400)
          .json("Veuillez télécharger au moins une image pour la galerie");
      }

      // Fetch the weather data for Tunis
      const weatherData = await getWeather();
      const temperature = `${weatherData.main.temp}°C`;

      const gallery = req.files["galerie"];
      const activite = new Activites({
        nom: req.body.nom,
        localisation: req.body.localisation,
        date_act: req.body.date_act,
        description: req.body.description,
        local: req.body.local,
        nblimite: req.body.nblimite,
        temperature: temperature, // Include the temperature
      });

      activite.galerie = gallery.map((img) => ({
        data: img.buffer,
        contentType: img.mimetype,
      }));
      await activite.save();

      console.log("Activité ajoutée avec succès");
      res.json("Activité ajoutée avec succès");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Interne du Serveur");
  }
}

async function show(req, res, next) {
  try {
    const data = await Activites.find();
    const weatherData = await getWeather(); // Get weather data for Tunis
    const temperature = `${weatherData.main.temp}°C`;
    const weatherCondition = weatherData.weather[0].main; // Assuming the API provides a main weather condition
    res.json({ activites: data, temperature, weatherCondition });
  } catch (err) {
    console.log(err);
  }
}

const updateActivite = async (req, res, next) => {
  try {
    const weatherData = await getWeather();
    const temperature = `${weatherData.main.temp}°C`;
    const activite = {
      nom: req.body.nom,
      localisation: req.body.localisation,
      date_act: req.body.date_act,
      description: req.body.description,
      local: req.body.local,
      nblimite: req.body.nblimite,
      temperature: temperature,
      // Do not update galerie here
    };

    const updatedActivite = await Activites.findByIdAndUpdate(
      req.params.id,
      activite,
      { new: true }
    );

    console.log("Activité mise à jour avec succès :", updatedActivite);
    res.json(updatedActivite);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'activité :', err);
    res.status(500).json('Erreur serveur');
  }
};

const uploadImages = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error('Multer error:', err);
        return res.status(500).json('Error uploading files');
      }
      
      if (!req.files || !req.files['galerie']) {
        return res.status(400).json('No images uploaded for the gallery');
      }

      const images = req.files['galerie'].map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));

      const activite = await Activites.findById(req.params.id);
      if (!activite) {
        return res.status(404).json('Activité non trouvée');
      }

      activite.galerie.push(...images);
      await activite.save();

      res.json('Images téléchargées avec succès');
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json('Erreur serveur');
  }
};

async function getActiviteId(req, res, next) {
  try {
    const activites = await Activites.findById(req.params.id);
    if (!activites) {
      return res.status(404).json("Activites not found");
    }
    res.json(activites);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching Activites");
  }
}
async function deleteActivites(req, res, next) {
  try {
    await Activites.findByIdAndDelete(req.params.id);
    res.send("Removed");
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  add,
  updateActivite,
  show,
  deleteActivites,
  getActiviteId,
  uploadImages,
};
