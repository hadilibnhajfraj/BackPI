const EmploiEnseignant = require('../model/emploieEnseignant');
const multer = require("multer");
const Classe = require('../model/class');
const Salle = require('../model/salle');
const User = require('../model/user');
const Matiere = require('../model/matiere');


async function add(req, res, next) {
    try {
        // Retrieve the current year
        const currentYear = new Date().getFullYear();
        // Create and save the Emploi without any file path
        const emploieEnseignant = new EmploiEnseignant({
            year: currentYear, // Automatic year selection
            enseignant: req.body.enseignant,
            file: "", // Empty file field initially
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin
        });

        await emploi.save();
        res.status(200).json({ _id: emploi._id, message: "Emploi ajouté avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while adding the emploi.");
    }
}

async function show(req, res, next) {
    try {
        const data = await EmploiEnseignant.find()
            .populate({
                path: 'seances',
                populate: [
                    {
                        path: 'salle',
                        model: Salle,
                        select: 'name'
                    },
                    {
                        path: 'enseignant',
                        model: User,
                        select: 'firstName lastName'
                    },
                    {
                        path: 'matiere',
                        model: Matiere,
                        select: 'nom'
                    },
                    {
                        path: 'class',
                        model: Classe,
                        select: 'name'
                    }
                ]
            });

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/emplois"); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // File name for uploaded file
    }
});

const upload = multer({ storage: storage }).single("file"); // "document" is the name of the file field in the form, allowing only one file


async function updated(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "An error occurred while11111 uploading files." });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ message: "An error occurred while uploading files." });
            }

            // Fetch the existing Emploi document
            const existingEmploi = await EmploiEnseignant.findById(req.params.id);

            // Construct the updated fields object by merging existing fields with request body fields
            const updatedFields = { ...existingEmploi.toObject(), ...req.body };

            // If a file was uploaded, update the file field with the new file path
            if (req.file) {
                updatedFields.file = req.file.path;
            }

            // Update the Emploi with the updated fields
            await EmploiEnseignant.findByIdAndUpdate(req.params.id, updatedFields);
            res.status(200).send({ message: "Emploi updated" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while updating the emploi.");
    }
}

// Delete Emploi and associated Seances
async function deleted(req, res, next) {
    try {
        await EmploiEnseignant.findByIdAndDelete(req.params.id);
        res.send({ message: "remouved" });
    } catch (err) {
        console.log(err);
    }
}

async function showById(req, res, next) {
    try {
        const enseignantId = req.params.id;
        const data = await EmploiEnseignant.find({ enseignant: enseignantId })
            .populate({
                path: 'seances',
                populate: [
                    { path: 'salle', model: Salle, select: 'name' },
                    { path: 'enseignant', model: User, select: 'firstName lastName' },
                    { path: 'matiere', model: Matiere, select: 'nom' },
                    { path: 'class', model: Classe, select: 'name' }
                ]
            })
            .populate('enseignant', 'firstName lastName'); // Optionnel : pour ne récupérer que les noms de l'enseignant

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Aucun emploi enseignant trouvé pour cet ID d\'enseignant' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données.' });
    }
}


module.exports = { add, show, updated, deleted, showById };