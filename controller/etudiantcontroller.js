
const Etudiant = require("../model/etudiant");
const Eleve = require("../model/eleve");
const Classe = require("../model/lesclass");
const User = require("../model/user");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("image", 5);

async function add(req, res) {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError || err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Erreur lors du téléversement des fichiers." });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Aucun fichier téléchargé." });
      }

      const image = req.files.map((file) => file.path);

      // Récupérer les données de la requête et assigner correctement classe.nom et classe._id
      const etudiantData = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        date_de_naissance: req.body.date_de_naissance,
        adresse: req.body.adresse,
        niveau: req.body.niveau,
        situation_familiale: req.body.situation_familiale,
        id_user: req.body.id_user,
        image: image,
        classe: req.body.classe,

      };

      const etudiant = new Etudiant(etudiantData);
      await etudiant.save();
      res.status(200).json({ message: "Étudiant ajouté avec succès" });
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'étudiant:", err);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'étudiant." });
  }
}




async function show(req, res, next) {
    try {
        const data = await Etudiant.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}


async function updated(req, res) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError || err) {
                console.log(err);
                return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
            }

            const etudiantId = req.params.id;

            // Trouver l'étudiant existant par son ID
            const existingEtudiant = await Etudiant.findById(etudiantId);
            if (!existingEtudiant) {
                return res.status(404).json({ message: "Étudiant non trouvé." });
            }

            // Supprimer les anciennes images si de nouvelles images sont téléchargées
            if (req.files && req.files.length > 0) {
                // Supprimer les anciennes images du système de fichiers
                if (existingEtudiant.image && existingEtudiant.image.length > 0) {
                    existingEtudiant.image.forEach(img => {
                        if (fs.existsSync(img)) {
                            fs.unlinkSync(img); // Suppression de l'image existante
                        }
                    });
                }

                // Mettre à jour le chemin d'accès des images avec les nouveaux fichiers téléchargés
                existingEtudiant.image = req.files.map(file => file.path);
            }

            // Mettre à jour les autres champs de l'étudiant
            existingEtudiant.nom = req.body.nom;
            existingEtudiant.prenom = req.body.prenom;
            existingEtudiant.date_de_naissance = req.body.date_de_naissance;
            existingEtudiant.adresse = req.body.adresse;
            existingEtudiant.niveau = req.body.niveau;
            existingEtudiant.situation_familiale = req.body.situation_familiale;
            existingEtudiant.id_user = req.body.id_user;
            existingEtudiant.classe = req.body.classe;

            // Enregistrer l'étudiant mis à jour dans la base de données
            await existingEtudiant.save();

            res.status(200).json({ message: "Étudiant mis à jour avec succès", etudiant: existingEtudiant });
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant." });
    }
}

async function deleted(req, res, next) {
    try {
        await Etudiant.findByIdAndDelete(req.params.id);
        res.status(200).json("Etudiant deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Etudiant.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Etudiant.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};

async function addEtudiant(req, res, next) {
    try {
      //console.log("body :" + JSON.stringify(req.body));
      const etudiant = new Eleve(req.body);
      const savedEtudiant = await etudiant.save();
  
      // Ajouter l'ID de l'étudiant à la classe correspondante
      await Classe.findByIdAndUpdate(req.body.classe, {
        $push: { students: savedEtudiant._id }
      });
  
      res.send({ message: "Etudiant ajouté et classe mise à jour" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Erreur lors de l'ajout de l'étudiant" });
    }
  }
  
  async function showEtudiant(req, res, next) {
    try {
      const data = await Eleve.find().populate({
        path: 'classe',
        model: Classe,
        select: 'name'
      }).populate({
        path: 'id_user',
        model: User,
        select: 'firstName lastName'
      });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données étudiantes.' });
    }
  }
  
  
  async function updateEtudiant(req, res, next) {
    try {
      const etudiantId = req.params.id;
      const newClasseId = req.body.class; // Nouvel ID de la classe à laquelle l'étudiant doit être assigné
  
      // Trouver l'étudiant actuel
      const etudiant = await Eleve.findById(etudiantId);
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
      const oldClasseId = etudiant.class; // ID de la classe actuelle de l'étudiant
  
      // Vérifier si la classe a été modifiée
      if (newClasseId !== oldClasseId) {
        // Retirer l'étudiant de la classe actuelle
        await Classe.findByIdAndUpdate(oldClasseId, {
          $pull: { students: etudiantId }
        });
  
        // Ajouter l'étudiant à la nouvelle classe
        await Classe.findByIdAndUpdate(newClasseId, {
          $addToSet: { students: etudiantId }
        });
  
        // Mettre à jour l'étudiant avec les nouvelles informations, y compris la nouvelle classe
        await Eleve.findByIdAndUpdate(etudiantId, req.body);
      } else {
        // Si la classe n'a pas été modifiée, simplement mettre à jour l'étudiant
        await Eleve.findByIdAndUpdate(etudiantId, req.body);
      }
  
      res.status(200).json({ message: "Étudiant mis à jour avec succès" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant" });
    }
  }
  
  async function deleteEtudiant(req, res, next) {
    try {
      const etudiant = await Eleve.findById(req.params.id);
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
      // Récupérer l'ID de la classe de l'étudiant
      const classeId = etudiant.classe;
  
      // Supprimer l'étudiant de la liste des étudiants de la classe
      await Classe.findByIdAndUpdate(classeId, {
        $pull: { students: req.params.id }
      });
  
      // Supprimer l'étudiant lui-même
      await Eleve.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: "Étudiant supprimé avec succès" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la suppression de l'étudiant" });
    }
  }
  
  const changeStudentClass = async (req, res, next) => {
    const studentId = req.params.ids;
    const newClassId = req.params.idc;
  
    try {
      console.log(`Starting class change for student ID: ${studentId}`);
  
      // Find the student by ID
      const student = await Eleve.findById(studentId).exec();
      if (!student) {
        console.log("Student not found");
        return res.status(404).json({ error: "Student not found" });
      }
      console.log(`Found student: ${student._id}, current class: ${student.classe}`);
  
      // Get the current class ID
      const currentClassId = student.classe;
  
      // Check if the new class ID is different from the current class ID
      if (currentClassId === newClassId) {
        console.log("The new class is the same as the current class. No changes needed.");
        return res.status(400).json({ error: "The new class is the same as the current class." });
      }
  
      // Remove the student from the current class's student list
      if (currentClassId) {
        console.log(`Removing student from current class ID: ${currentClassId}`);
        await Classe.findByIdAndUpdate(currentClassId, {
          $pull: { students: studentId }
        });
        console.log(`Removed student ${studentId} from class ${currentClassId}`);
      } else {
        console.log("Student does not belong to any class currently");
      }
  
      // Update the student's class field to the new class ID
      console.log(`Updating student's class to new class ID: ${newClassId}`);
      student.classe = newClassId;
      await student.save();
      console.log(`Updated student's class to ${newClassId}`);
  
      // Add the student to the new class's student list
      console.log(`Adding student to new class ID: ${newClassId}`);
      await Classe.findByIdAndUpdate(newClassId, {
        $push: { students: studentId }
      });
      console.log(`Added student ${studentId} to new class ${newClassId}`);
  
      res.status(200).json({ message: "Student class changed successfully" });
      console.log("Student class changed successfully");
    } catch (error) {
      console.error("Error changing student class:", error);
      res.status(500).json({ error: "An error occurred while changing the student's class" });
    }
  };
  
  const recherche = async (req, res) => {
    try {
      const keyword = req.query.keyword;
      const etudiants = await Eleve.find({
        $or: [
          { prenom: { $regex: keyword, $options: 'i' } },
          { nom: { $regex: keyword, $options: 'i' } }
        ]
      })
      .populate('classe', 'name') // Populate class name
      .populate('id_user', 'firstName lastName'); // Populate parent info
  
      res.status(200).json(etudiants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { add, show, updated, deleted, allbyId, showByone , recherche, showEtudiant, updateEtudiant, deleteEtudiant , addEtudiant , changeStudentClass};