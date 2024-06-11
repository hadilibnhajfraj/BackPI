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

async function update(req, res, next) {

  upload(req, res, async function (err) {
    if (err) {
      console.error("Erreur Multer :", err);
      return res.status(500).send("Erreur Multer");
    }
    if (!req.files || !req.files["galerie"]) {
      console.log("Aucune image téléchargée pour la galerie");
      return res
        .status(400)
        .send("Veuillez télécharger au moins une image pour la galerie");
    }

    const gallery = req.files["galerie"];
    const activite = {
      nom: req.body.nom,
      localisation: req.body.localisation,
      date_act: req.body.date_act,
      description: req.body.description,
      local: req.body.local,
      nblimite: req.body.nblimite
    };
    activite.galerie = gallery.map((img) => ({
      data: img.buffer,
      contentType: img.mimetype,
    }));
    const updatedActivite = await Activites.findByIdAndUpdate(req.params.id, activite, { new: true });

    console.log("Activité mise à jour avec succès :", updatedActivite);
    res.json(updatedActivite);
  });
}


async function deleteActivites(req, res, next) {
  try {
    await Activites.findByIdAndDelete(req.params.id);
    res.send("Removed");
  } catch (err) {
    console.log(err);
  }
}
module.exports = { add, update, show, deleteActivites };
