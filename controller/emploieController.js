const Seance = require('../model/seance');
const Emploi = require('../model/emploi');
const multer = require("multer");
const Classe = require('../model/class');
const Salle = require('../model/salle');
const User = require('../model/user');
const Matiere = require('../model/matiere');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Etudiant = require('../model/etudiant');


// Function to calculate the next Monday and the following Saturday for the given week offset
const getNextMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const nextMonday = new Date(now);

    if (dayOfWeek === 0) {
        // If today is Sunday, the next Monday is tomorrow
        nextMonday.setDate(now.getDate() + 1);
    } else if (dayOfWeek !== 1) {
        // If today is not Monday, calculate the days remaining to the next Monday
        nextMonday.setDate(now.getDate() + (8 - dayOfWeek));
    }

    nextMonday.setHours(0, 0, 0, 0); // Set time to start of the day

    return nextMonday;
};

const getWeekStartAndEnd = (offsetWeeks = 0) => {
    const startOfWeek = getNextMonday();

    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + offsetWeeks * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day

    return { startOfWeek, endOfWeek };
};

async function add(req, res, next) {
    try {
        // Retrieve the current year
        const currentYear = new Date().getFullYear();

        const offsetWeeks = parseInt(req.body.offsetWeeks || '0', 10);
        const { startOfWeek, endOfWeek } = getWeekStartAndEnd(offsetWeeks);

        // Create and save the Emploi without any file path
        const emploi = new Emploi({
            year: currentYear, // Automatic year selection
            // Add other fields as needed
            class: req.body.class,
            file: "", // Empty file field initially
            date_debut: startOfWeek,
            date_fin: endOfWeek
        });

        await emploi.save();
        res.status(200).send("Emploi ajouté avec succès.");
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while adding the emploi.");
    }
}





async function show(req, res, next) {
    try {
        const data = await Emploi.find()
            .populate({
                path: 'class',
                model: Classe,
                select: 'name'
            })
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
            const existingEmploi = await Emploi.findById(req.params.id);

            // Construct the updated fields object by merging existing fields with request body fields
            const updatedFields = { ...existingEmploi.toObject(), ...req.body };

            // If a file was uploaded, update the file field with the new file path
            if (req.file) {
                updatedFields.file = req.file.path;
            }

            // Update the Emploi with the updated fields
            await Emploi.findByIdAndUpdate(req.params.id, updatedFields);
            res.status(200).send("Emploi updated");
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while updating the emploi.");
    }
}

// Delete Emploi and associated Seances
async function deleted(req, res, next) {
    try {
        const emploiId = req.params.id;

        // Check if the Emploi exists
        const emploi = await Emploi.findById(emploiId);
        if (!emploi) {
            return res.status(404).json({ message: 'Emploi not found' });
        }

        // Log associated seances before deletion
        const associatedSeances = await Seance.find({ emploie: emploiId });
        console.log('Associated Seances before deletion:', associatedSeances);

        // Delete associated seances
        await Seance.deleteMany({ emploie: emploiId });

        // Log associated seances after deletion
        const remainingSeances = await Seance.find({ emploie: emploiId });
        console.log('Associated Seances after deletion:', remainingSeances);

        // Delete the emploi
        await Emploi.findByIdAndDelete(emploiId);

        res.send("Emploi and associated seances removed");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred while deleting the emploi' });
    }
}


const seanceTimes = {
    1: { heure_debut: 8, heure_fin: 9 },
    2: { heure_debut: 9, heure_fin: 10 },
    3: { heure_debut: 10, heure_fin: 11 },
    4: { heure_debut: 11, heure_fin: 12 },
    5: { heure_debut: 13, heure_fin: 14 },
    6: { heure_debut: 14, heure_fin: 15 },
    7: { heure_debut: 15, heure_fin: 16 },
    8: { heure_debut: 16, heure_fin: 17 },
};

async function addSeance(req, res, next) {
    try {
        const { emploiId, classId } = req.params;
        const { num_seance, matiere, salle, enseignant, date } = req.body;

        const { heure_debut, heure_fin } = seanceTimes[num_seance];

        const emploi = await Emploi.findById(emploiId);
        if (!emploi) {
            return res.status(404).json({ message: 'Emploi not found' });
        }

        const seanceDate = new Date(date);
        const emploiDateDebut = new Date(emploi.date_debut);
        const emploiDateFin = new Date(emploi.date_fin);

        if (seanceDate < emploiDateDebut || seanceDate > emploiDateFin) {
            return res.status(400).json({ message: 'Seance date is out of the employment period' });
        }

        const conflict = await Seance.findOne({
            date: seanceDate,
            $or: [
                { salle: salle, heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } },
                { enseignant: enseignant, heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: 'Scheduling conflict detected' });
        }

        const newSeance = new Seance({
            num_seance,
            emploie: emploiId,
            heure_debut,
            heure_fin,
            matiere,
            salle,
            class: classId,
            enseignant,
            date: seanceDate
        });

        await newSeance.save();

        emploi.seances.push(newSeance._id);
        await emploi.save();

        res.status(200).json({ message: 'Seance added successfully', seance: newSeance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while adding the seance' });
    }
}

async function extendEmploie(req, res, next) {
    try {
        const emploiId = req.params.id;
        const existingEmploi = await Emploi.findById(emploiId);
        if (!existingEmploi) {
            return res.status(404).send("Emploi non trouvé.");
        }

        // Récupérer le nombre de semaines supplémentaires à ajouter à l'emploi existant
        let additionalWeeks = parseInt(req.params.additionalWeeks || '0', 10);
        if (additionalWeeks > 10) {
            return res.status(400).send("Le nombre de semaines supplémentaires ne peut pas dépasser 10.");
        }

        // Calculer la nouvelle date de fin en ajoutant les semaines supplémentaires à la date de fin actuelle
        const currentEndDate = new Date(existingEmploi.date_fin);
        currentEndDate.setDate(currentEndDate.getDate() + additionalWeeks * 7);

        // Mettre à jour l'emploi existant avec la nouvelle date de fin
        existingEmploi.date_fin = currentEndDate;

        await existingEmploi.save();
        res.status(200).send("Emploi étendu avec succès.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Une erreur est survenue lors de l'extension de l'emploi.");
    }
}


async function showById(req, res, next) {
    try {
        const emploiId = req.params.id;
        const data = await Emploi.findById(emploiId)
            .populate({
                path: 'class',
                model: Classe,
                select: 'name'
            })
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
                    }
                ]
            });

        if (!data) {
            return res.status(404).json({ error: 'Emploi not found' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
}

async function showByClassId(req, res, next) {
    try {
        const classId = req.params.id;
        const data = await Emploi.find({ class: classId })
            .populate({
                path: 'class',
                model: Classe,
                select: 'name'
            })
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
                    }
                ]
            });

        if (data.length === 0) {
            return res.status(404).json({ error: 'No emplois found for this class' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
}


const generateTimetablePDF = async (req, res) => {
    const emploiId = req.params.id;

    try {
        const emploi = await Emploi.findById(emploiId)
            .populate({
                path: 'class',
                model: Classe,
                select: 'name'
            })
            .populate({
                path: 'seances',
                populate: [
                    {
                        path: 'salle',
                        model: 'Salle',
                        select: 'name'
                    },
                    {
                        path: 'enseignant',
                        model: 'User',
                        select: 'firstName lastName'
                    },
                    {
                        path: 'matiere',
                        model: 'Matiere',
                        select: 'nom'
                    },
                ]
            });

        if (!emploi) {
            console.log('No emploi found with this ID');
            return res.status(404).send('No emploi found with this ID');
        }

        // Ajouter les horaires de séance en tant qu'en-têtes de colonne
        const seanceTimes = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];

        // Créer l'objet des jours de la semaine avec les dates appropriées
        const joursSemaine = {
            lundi: new Date(emploi.date_debut),
            mardi: new Date(emploi.date_debut),
            mercredi: new Date(emploi.date_debut),
            jeudi: new Date(emploi.date_debut),
            vendredi: new Date(emploi.date_debut),
            samedi: new Date(emploi.date_debut)
        };

        // Ajuster les dates pour chaque jour de la semaine
        Object.keys(joursSemaine).forEach((jour, index) => {
            joursSemaine[jour].setDate(joursSemaine[jour].getDate() + index);
        });

        // Initialize timetable data structure
        const timetable = {};
        const dates = Object.keys(joursSemaine); // Stocker les jours de la semaine

        // Initialiser toutes les combinaisons de jours et d'heures de début dans timetable
        dates.forEach(date => {
            timetable[date] = {};
            seanceTimes.forEach(time => {
                timetable[date][time] = [];
            });
        });

        // Remplir la structure du tableau avec les données des séances
        emploi.seances.forEach(seance => {
            const seanceDate = new Date(seance.date);
            const seanceDay = seanceDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase(); // Obtenez le jour de la semaine en minuscules
            const startTime = `${seance.heure_debut.toString().padStart(2, '0')}:00 - ${seance.heure_fin.toString().padStart(2, '0')}:00`;

            // Vérifier si la combinaison de jour et d'heure de début existe dans timetable
            if (timetable[seanceDay] && timetable[seanceDay][startTime]) {
                // Ajouter la séance à timetable
                timetable[seanceDay][startTime].push({
                    matiere: seance.matiere.nom,
                    enseignant: `${seance.enseignant.firstName} ${seance.enseignant.lastName}`,
                    salle: seance.salle.name
                });
            } else {
                console.log(`Combinaison invalide de jour et d'heure: ${seanceDay}, ${startTime}`);
            }
        });

        // Générer le PDF
        const doc = new PDFDocument({ layout: 'landscape' }); // Changer la disposition en paysage
        const fileName = `emploi_${emploiId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '..', 'uploads', 'emplois', fileName);
        doc.pipe(fs.createWriteStream(filePath));

        // Définir la taille de la police pour le titre
        doc.fontSize(14);

        // Calculer la position Y du tableau pour le centrer sur la page
        const cellWidth = 60;
        const cellHeight = 30;
        const tableWidth = seanceTimes.length * cellWidth; // Largeur du tableau en fonction du nombre de colonnes
        const tableHeight = (dates.length + 1) * cellHeight; // Hauteur du tableau en fonction du nombre de lignes
        const tableX = (doc.page.width - tableWidth) / 2; // Position X du tableau pour le centrer
        const tableY = (doc.page.height - tableHeight) / 2; // Position Y du tableau pour le centrer

        // Ajouter le titre centré
        doc.text(`Emploi du temps de la classe ${emploi.class.name} du ${emploi.date_debut.toDateString()} au ${emploi.date_fin.toDateString()}`, { align: 'center' });

        // Ajouter une marge supérieure après le titre
        doc.moveDown(2);

        // Ajouter les jours sur la gauche du tableau
        doc.fontSize(10); // Taille de police pour les jours
        dates.forEach((date, rowIndex) => {
            doc.text(date, tableX - 40, tableY + (rowIndex + 1) * cellHeight, { width: 40, align: 'center' }); // Ajuster la position des jours
        });

        // Ajouter les heures au-dessus des séances
        seanceTimes.forEach((time, index) => {
            doc.text(time, tableX + index * cellWidth, tableY, { width: cellWidth, align: 'center' }); // Ajuster la position des heures
        });

        // Taille de la police pour les séances
        const seanceFontSize = 7;

        // Parcourir les jours et les horaires des séances pour remplir le tableau
        dates.forEach((date, rowIndex) => {
            seanceTimes.forEach((time, colIndex) => {
                const seances = timetable[date][time] || [];
                let rowData = '';
                seances.forEach(seance => {
                    rowData += `${seance.matiere}\n${seance.enseignant}\n${seance.salle}\n\n`;
                });
                // Dessiner une bordure autour de chaque cellule
                doc.rect(tableX + colIndex * cellWidth, tableY + (rowIndex + 1) * cellHeight, cellWidth, cellHeight).stroke();
                // Ajuster la position pour les données de séance
                doc.fontSize(seanceFontSize).text(rowData, tableX + colIndex * cellWidth + 2, tableY + (rowIndex + 1) * cellHeight + 2, { width: cellWidth - 4, height: cellHeight - 4, align: 'center' });
            });
        });

        doc.end();

        emploi.file = fileName; // Mettre à jour le champ du nom du fichier
        await emploi.save();
        return filePath;

    } catch (err) {
        console.error('Error generating PDF:', err);
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
        }
    }
};

const generateTimetableForTeacherPDF = async (req, res) => {
    const emploiId = req.params.id;
    const enseignantId = req.params.ide;

    try {
        // Trouver l'emploi du temps
        const emploi = await Emploi.findById(emploiId)
            .populate({
                path: 'class',
                model: Classe,
                select: 'name'
            })
            .populate({
                path: 'seances',
                populate: [
                    {
                        path: 'salle',
                        model: 'Salle',
                        select: 'name'
                    },
                    {
                        path: 'enseignant',
                        model: 'User',
                        select: 'firstName lastName'
                    },
                    {
                        path: 'matiere',
                        model: 'Matiere',
                        select: 'nom'
                    },
                ]
            });

        if (!emploi) {
            console.log('No emploi found with this ID');
            return res.status(404).send('No emploi found with this ID');
        }

        // Trouver les informations de l'enseignant
        const enseignant = await User.findById(enseignantId).select('firstName lastName');
        if (!enseignant) {
            console.log('No enseignant found with this ID');
            return res.status(404).send('No enseignant found with this ID');
        }

        const enseignantName = `${enseignant.firstName}_${enseignant.lastName}`;

        // Ajouter les horaires de séance en tant qu'en-têtes de colonne
        const seanceTimes = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];

        // Créer l'objet des jours de la semaine avec les dates appropriées
        const joursSemaine = {
            lundi: new Date(emploi.date_debut),
            mardi: new Date(emploi.date_debut),
            mercredi: new Date(emploi.date_debut),
            jeudi: new Date(emploi.date_debut),
            vendredi: new Date(emploi.date_debut),
            samedi: new Date(emploi.date_debut)
        };

        // Ajuster les dates pour chaque jour de la semaine
        Object.keys(joursSemaine).forEach((jour, index) => {
            joursSemaine[jour].setDate(joursSemaine[jour].getDate() + index);
        });

        // Initialize timetable data structure
        const timetable = {};
        const dates = Object.keys(joursSemaine); // Stocker les jours de la semaine

        // Initialiser toutes les combinaisons de jours et d'heures de début dans timetable
        dates.forEach(date => {
            timetable[date] = {};
            seanceTimes.forEach(time => {
                timetable[date][time] = [];
            });
        });

        // Filtrer les séances pour ne conserver que celles de l'enseignant spécifié
        const filteredSeances = emploi.seances.filter(seance => seance.enseignant._id.toString() === enseignantId);

        // Remplir la structure du tableau avec les données des séances filtrées
        filteredSeances.forEach(seance => {
            const seanceDate = new Date(seance.date);
            const seanceDay = seanceDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase(); // Obtenez le jour de la semaine en minuscules
            const startTime = `${seance.heure_debut.toString().padStart(2, '0')}:00 - ${seance.heure_fin.toString().padStart(2, '0')}:00`;

            // Vérifier si la combinaison de jour et d'heure de début existe dans timetable
            if (timetable[seanceDay] && timetable[seanceDay][startTime]) {
                // Ajouter la séance à timetable
                timetable[seanceDay][startTime].push({
                    matiere: seance.matiere.nom,
                    enseignant: `${seance.enseignant.firstName} ${seance.enseignant.lastName}`,
                    salle: seance.salle.name
                });
            } else {
                console.log(`Combinaison invalide de jour et d'heure: ${seanceDay}, ${startTime}`);
            }
        });

        // Générer le PDF
        const doc = new PDFDocument({ layout: 'landscape' }); // Changer la disposition en paysage
        const fileName = `emploi_${emploiId}_enseignant_${enseignantId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '..', 'uploads', 'emplois', enseignantName, fileName);

        // Créer le répertoire de l'enseignant s'il n'existe pas
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        doc.pipe(fs.createWriteStream(filePath));

        // Définir la taille de la police pour le titre
        doc.fontSize(14);

        // Calculer la position Y du tableau pour le centrer sur la page
        const cellWidth = 60;
        const cellHeight = 30;
        const tableWidth = seanceTimes.length * cellWidth; // Largeur du tableau en fonction du nombre de colonnes
        const tableHeight = (dates.length + 1) * cellHeight; // Hauteur du tableau en fonction du nombre de lignes
        const tableX = (doc.page.width - tableWidth) / 2; // Position X du tableau pour le centrer
        const tableY = (doc.page.height - tableHeight) / 2; // Position Y du tableau pour le centrer

        // Ajouter le titre centré
        doc.text(`Emploi du temps de la classe ${emploi.class.name} du ${emploi.date_debut.toDateString()} au ${emploi.date_fin.toDateString()}`, { align: 'center' });

        // Ajouter une marge supérieure après le titre
        doc.moveDown(2);

        // Ajouter les jours sur la gauche du tableau
        doc.fontSize(10); // Taille de police pour les jours
        dates.forEach((date, rowIndex) => {
            doc.text(date, tableX - 40, tableY + (rowIndex + 1) * cellHeight, { width: 40, align: 'center' }); // Ajuster la position des jours
        });

        // Ajouter les heures au-dessus des séances
        seanceTimes.forEach((time, index) => {
            doc.text(time, tableX + index * cellWidth, tableY, { width: cellWidth, align: 'center' }); // Ajuster la position des heures
        });

        // Taille de la police pour les séances
        const seanceFontSize = 7;

        // Parcourir les jours et les horaires des séances pour remplir le tableau
        dates.forEach((date, rowIndex) => {
            seanceTimes.forEach((time, colIndex) => {
                const seances = timetable[date][time] || [];
                let rowData = '';
                seances.forEach(seance => {
                    rowData += `${seance.matiere}\n${seance.enseignant}\n${seance.salle}\n\n`;
                });
                // Dessiner une bordure autour de chaque cellule
                doc.rect(tableX + colIndex * cellWidth, tableY + (rowIndex + 1) * cellHeight, cellWidth, cellHeight).stroke();
                // Ajuster la position pour les données de séance
                doc.fontSize(seanceFontSize).text(rowData, tableX + colIndex * cellWidth + 2, tableY + (rowIndex + 1) * cellHeight + 2, { width: cellWidth - 4, height: cellHeight - 4, align: 'center' });
            });
        });

        doc.end();

        emploi.file = fileName; // Mettre à jour le champ du nom du fichier
        await emploi.save();
        return filePath;

    } catch (err) {
        console.error('Error generating PDF:', err);
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
        }
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 't0429597@gmail.com',
        pass: 'frrz sozl ivqu fudj',
    },
    secure: true,
    port: 587,
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 't0429597@gmail.com',
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

const saveTimetable = async (req, res) => {
    const emploiId = req.params.id;

    try {
        const emploi = await Emploi.findById(emploiId)
            .populate({
                path: 'class',
                model: Classe,
                select: 'name',
                populate: [
                    {
                        path: 'students',
                        model: 'etudiant',
                        select: 'email id_user',
                    },
                    {
                        path: 'teachers',
                        model: 'User',
                        select: 'email firstName lastName',
                    },
                ],
            });

        if (!emploi) {
            console.log('No emploi found with this ID');
            return res.status(404).send('No emploi found with this ID');
        }

        // Generate general timetable PDF
        const generalFileName = `emploi_${emploiId}_${Date.now()}.pdf`;
        const generalFilePath = await generateTimetablePDF(req, res);

        // Send emails

        // Send general timetable to students and parents
        const studentEmails = emploi.class.students.filter(student => student) // Filter out undefined students
            .map(student => student.email);

        if (emploi.class.students && emploi.class.students.length > 0) { // Check for students before populating
            const parentEmails = await Etudiant.find({ _id: { $in: emploi.class.students }, id_user: { $exists: true } })
                .populate('id_user', 'email')
                .then(students => students.map(student => student.id_user ? student.id_user.email : undefined));

            const generalMailOptions = {
                from: 't0429597@gmail.com',
                to: [...studentEmails, ...parentEmails.filter(email => email)], // Filter out undefined emails
                subject: 'Emploi du temps général',
                text: 'Veuillez trouver ci-joint l\'emploi du temps général de votre classe.',
                attachments: [
                    {
                        filename: generalFileName,
                        path: generalFilePath,
                    },
                ],
            };

            await transporter.sendMail(generalMailOptions);
        }

        // Generate timetables for each teacher
        const teachers = emploi.seances.map(seance => seance.enseignant);
        console.log('okziziz' + teachers);
        const teacherFilePromises = [];

        for (const teacher of teachers) {
            req.params.ide = teacher._id;
            const teacherFilePath = await generateTimetableForTeacherPDF(req, res);
            teacherFilePromises.push(teacherFilePath);
        }

        // Wait for all teacher file promises to resolve
        const teacherFilePaths = await Promise.all(teacherFilePromises);

        // Send specific timetable to each teacher
        for (let i = 0; i < teachers.length; i++) {
            const teacher = teachers[i];
            const teacherFileName = `emploi_${emploiId}_enseignant_${teacher._id}_${Date.now()}.pdf`;
            const teacherFilePath = teacherFilePaths[i];

            const teacherMailOptions = {
                from: 't0429597@gmail.com',
                to: teacher.email,
                subject: 'Votre emploi du temps',
                text: 'Veuillez trouver ci-joint votre emploi du temps.',
                attachments: [
                    {
                        filename: teacherFileName,
                        path: teacherFilePath,
                    },
                ],
            };

            await transporter.sendMail(teacherMailOptions);
        }

        res.status(200).send('Emplois du temps générés et envoyés par email avec succès')
    }
    catch (err) {
        console.error('Error saving timetable:', err);
        if (!res.headersSent) {
            res.status(500).send('Error saving timetable');
        }
    }
}






module.exports = { add, show, updated, deleted, addSeance, extendEmploie, showById, showByClassId, generateTimetablePDF, generateTimetableForTeacherPDF, saveTimetable };