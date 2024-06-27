const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: '8f706b19b89ce6',
        pass: '3cebedb76ff201',
    }
});

// Configure the mail options
const mailOptions = {
    from: 'mimibhaj@gmail.com',
    to: 'meriem.benhajji@esprit.tn',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

// Function to send email
function sendMail() {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendMail };
