const nodemailer = require('nodemailer');

// Ajoutez ce code pour activer le débogage de nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "t0429597@gmail.com",
    pass: "frrz sozl ivqu fudj",
  },
  secure: true, // Utilisez le port sécurisé
  port: 587, // Port sécurisé pour Gmail
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'abderraouf.ochi@esprit.com', // Remplacez par votre email
    to: to,
    subject: subject,
    text: text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
