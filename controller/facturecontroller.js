const Facture = require("../model/facture");
const Cheque = require("../model/cheque");
const PDFDocument = require('pdfkit');

// Ajouter une facture
async function addFacture(req, res, next) {
  try {
    const facture = new Facture(req.body);
    await facture.save();
    res.send("Facture ajoutée");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de l'ajout de la facture");
  }
}

// Afficher toutes les factures
async function show(req, res, next) {
  try {
    const data = await Facture.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

// Mettre à jour une facture
async function update(req, res, next) {
  try {
    await Facture.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

// Supprimer une facture
async function deletefacture(req, res, next) {
  try {
    await Facture.findByIdAndDelete(req.params.id);
    res.send("deleted");
  } catch (err) {
    console.log(err);
  }
}

// Générer un PDF pour une facture spécifique
async function generatePdf(req, res, next) {
  try {
    const facture = await Facture.findById(req.params.id).populate({
      path: 'offreId',
      populate: {
        path: 'frais'
      }
    });

    if (!facture) {
      return res.status(404).send('Facture non trouvée');
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    let filename = `facture-${facture.reference}.pdf`;
    // Remove spaces from the filename
    filename = encodeURIComponent(filename);
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Stream the PDF to the response
    doc.pipe(res);

    // Add the content to the PDF
    doc.fontSize(25).text('Facture', { align: 'center' });
    doc.fontSize(18).text(`Référence: ${facture.reference}`);
    doc.fontSize(18).text(`Date: ${facture.date.toLocaleDateString()}`);
    doc.fontSize(18).text(`Client: ${facture.client}`);
    doc.fontSize(18).text(`Offre: ${facture.nomOffre}`);
    doc.fontSize(18).text(`Montant après remise: ${facture.montantApresRemise.toFixed(3)} TND`);
    doc.fontSize(18).text(`Statut: ${facture.statut}`);

    doc.moveDown();

    doc.fontSize(18).text('Frais:', { underline: true });
    if (facture.offreId && facture.offreId.frais && facture.offreId.frais.length > 0) {
      facture.offreId.frais.forEach(frais => {
        if (frais && frais.nom) {
          doc.fontSize(16).text(`- ${frais.nom}`);
        } else {
          doc.fontSize(16).text(`- Frais non spécifié`);
        }
      });
    } else {
      doc.fontSize(16).text('Aucun frais');
    }

    // Finalize the PDF and end the stream
    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
}

// Afficher les paiements par chèque pour chaque facture
async function getChequesForFacture(req, res, next) {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    const cheques = await Cheque.find({ factureId: req.params.id });
    if (!cheques || cheques.length === 0) {
      return res.status(404).send("Aucun chèque trouvé pour cette facture");
    }

    const chequesInfo = cheques.map(cheque => ({
      reference: cheque.reference,
      montant: cheque.montant,
      echeance: cheque.echeance
    }));

    res.json({
      facture: {
        reference: facture.reference,
        montantApresRemise: facture.montantApresRemise,
        montantCheque: facture.montantCheque,
        montantRestant: facture.montantRestant,
        statut: facture.statut,
      },
      nombreDeCheques: cheques.length,
      cheques: chequesInfo
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des informations des chèques");
  }
}

module.exports = { addFacture, show, update, deletefacture, generatePdf, getChequesForFacture };
