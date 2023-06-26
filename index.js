
///esta es la iniciALIZACION DE NOMAILDER PARA PODER ENVIAR EL CORREO CON FIREBASE


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Transporter Configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

exports.yourFunctionName = functions.https.onRequest((request, response) => {
  // Use the `transporter` here to send an email...

  // Example:
  let mailOptions = {
    // config for the email content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});
