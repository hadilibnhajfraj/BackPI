const Bus = require("../model/Bus");
const Chauffeur = require("../model/Chauffeur");
async function add(req, res, next) {
  try {
    const { itineraire, matricule } = req.body;

    // Vérifier que le départ et l'arrivée ne sont pas les mêmes
    if (itineraire.depart === itineraire.arrivee) {
      return res
        .status(400)
        .json(
          "Le départ et l'arrivée de l'itinéraire ne peuvent pas être les mêmes."
        );
    }

    // Vérifier l'unicité du matricule
    const existingBus = await Bus.findOne({ matricule });
    if (existingBus) {
      return res
        .status(400)
        .json(
          "Le matricule doit être unique. Un bus avec ce matricule existe déjà."
        );
    }

    const bus = new Bus(req.body);
    await bus.save();

    const chauffeurId = req.body.chauffeur;
    if (chauffeurId) {
      const chauffeur = await Chauffeur.findById(chauffeurId);
      if (chauffeur) {
        chauffeur.disponibilite = false;
        await chauffeur.save();
      }
    }

    res.status(200).json("Bus ajouté avec succès");
  } catch (err) {
    console.log(err);
    res.status(500).json("Erreur lors de l'ajout du bus");
  }
}

async function show(req, res, next) {
  try {
    const data = await Bus.find().populate("chauffeur");
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching buses");
  }
}

async function update(req, res, next) {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json("Bus not found");
    }

    const oldChauffeurId = bus.chauffeur;
    const newChauffeurId = req.body.chauffeur;

    await Bus.findByIdAndUpdate(req.params.id, req.body);

    if (oldChauffeurId && oldChauffeurId.toString() !== newChauffeurId) {
      const oldChauffeur = await Chauffeur.findById(oldChauffeurId);
      if (oldChauffeur) {
        oldChauffeur.disponibilite = true;
        await oldChauffeur.save();
      }
    }

    if (newChauffeurId) {
      const newChauffeur = await Chauffeur.findById(newChauffeurId);
      if (newChauffeur) {
        newChauffeur.disponibilite = false;
        await newChauffeur.save();
      }
    }

    res.json("Bus updated");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error updating bus");
  }
}

async function deleteBus(req, res, next) {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (bus) {
      const chauffeurId = bus.chauffeur;
      if (chauffeurId) {
        const chauffeur = await Chauffeur.findById(chauffeurId);
        if (chauffeur) {
          chauffeur.disponibilite = true;
          await chauffeur.save();
        }
      }
    }
    res.json("Bus removed");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error removing bus");
  }
}
async function getBus(req, res, next) {
  try {
    const bus = await Bus.findById(req.params.id).populate(
      "chauffeur"
    );
    if (!bus) {
      return res.status(404).send("chauffeur not found");
    }
    res.json(bus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chauffeur");
  }
}
async function addChauffeur(req, res, next) {
  try {
    const chauffeur = new Chauffeur(req.body);
    await chauffeur.save();
    res.status(200).json("Chauffeur added");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error adding chauffeur");
  }
}

async function updateChauffeur(req, res, next) {
  try {
    await Chauffeur.findByIdAndUpdate(req.params.id, req.body);
    res.json("Chauffeur updated");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error updating chauffeur");
  }
}

async function deleteChauffeur(req, res, next) {
  try {
    await Chauffeur.findByIdAndDelete(req.params.id);
    res.json("Chauffeur removed");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error removing chauffeur");
  }
}
async function showChauffeur(req, res, next) {
  try {
    const data = await Chauffeur.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching buses");
  }
}
async function getChauffeurId(req, res, next) {
  try {
    const bus = await Chauffeur.findById(req.params.id)
    if (!bus) {
      return res.status(404).send("chauffeur not found");
    }
    res.json(bus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chauffeur");
  }
}
module.exports = {
  add,
  update,
  show,
  deleteBus,
  addChauffeur,
  updateChauffeur,
  deleteChauffeur,
  showChauffeur,
  getBus,
  getChauffeurId
};
