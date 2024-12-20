const nodemailer = require('nodemailer');
const EventEmitter = require('node:events');
const hbs = require('nodemailer-express-handlebars')
const path = require('path');
const emalEmitter = new EventEmitter();

emalEmitter.on('patientReferEmailIntemation', async (patientData) => {
    console.log('patientData...', patientData)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, //'email-smtp.us-west-2.amazonaws.comsmtp.gmail.com', // Amazon SES SMTP endpoint
        port: process.env.SMTP_PORT, // Port for secure SMTP
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME, // Your SMTP username
            pass: process.env.SMTP_PASSWORD // Your SMTP password
        }
    });


    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/patients/'),
    };
    transporter.use('compile', hbs(handlebarOptions))
    const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL,
        template: "patientReferIntemation",
        to: patientData.patientEmail,
        subject: `You are referring to ${patientData.referringBranchName}`,
        context: {...patientData},
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return;
        }
        console.log('Email sent successfully!');
    });
});

emalEmitter.on('patientRegistrationIntemation', async (patientData) => {
    console.log('patientData...', patientData)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, //'email-smtp.us-west-2.amazonaws.comsmtp.gmail.com', // Amazon SES SMTP endpoint
        port: process.env.SMTP_PORT, // Port for secure SMTP
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME, // Your SMTP username
            pass: process.env.SMTP_PASSWORD // Your SMTP password
        }
    });


    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/patients/'),
    };
    transporter.use('compile', hbs(handlebarOptions))
    const mailOptions = {
        from:  process.env.SMTP_FROM_EMAIL,
        template: "patientRegistrationEmail",
        to: patientData.patientEmail,
        subject: `You have been registred`,
        context: {...patientData},
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return;
        }
        console.log('Email sent successfully!');
    });
});

emalEmitter.on('referralNotification', async (patientData) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/admins/'),
    };

    transporter.use('compile', hbs(handlebarOptions));
    const mailOptions = {
        from:  process.env.SMTP_FROM_EMAIL,
        template: "referralNotification", 
        to: patientData.referredBranchEmail, 
        subject: `New Referral Notification`,
        context: {...patientData},
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return;
        }
        console.log('Notification Email sent successfully!');
    });
});




exports.sendPatientReferIntemationEmail = async (data) => {
    emalEmitter.emit('patientReferEmailIntemation', data)
}

exports.sendPatientRegistrationIntemation = async (data) => {
    emalEmitter.emit('patientRegistrationIntemation', data)
}

exports.sendReferralNotification = async (data) => {
    emalEmitter.emit('referralNotification', data)
}