const User = require("../../database/models/auth/user");
const Token = require("../../helper/token");
const bcrypt = require("bcrypt");
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')

const sendResetPasswordMail = async ({username, resetPasswordLink, email}) => {
  // Create a Nodemailer transporter using SMTP
  // const transporter = nodemailer.createTransport({
  //     host: 'email-smtp.us-east-2.amazonaws.com', //'email-smtp.us-west-2.amazonaws.comsmtp.gmail.com', // Amazon SES SMTP endpoint
  //     port: 587, // Port for secure SMTP
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //         user: 'AKIA27JP5ZOGOVSTHLHG', // Your SMTP username
  //         pass: 'BAZSuhCnwtgIGEK3M/pAXMcdnT9TzW/4BCNDZ2I2c5ro' // Your SMTP password
  //     }
  // });
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, //'email-smtp.us-west-2.amazonaws.comsmtp.gmail.com', // Amazon SES SMTP endpoint
      port: 587, // Port for secure SMTP
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
      viewPath: path.resolve('./views/reset-password/'),
  };
  transporter.use('compile', hbs(handlebarOptions))
  // Define email data
  const mailOptions = {
      from: 'abhishek.kumar@techbitsolution.com',
      template: "resetPassword",
      to: email,
      subject: 'Reset Password Email',
      context: {
          username,
          resetPasswordLink
      },
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error occurred:', error.message);
          return;
      }
      console.log('Email sent successfully!');
  });
}


exports.post = async (req, res) => {
  try {
    const { firstName, lastName, email, password,role } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password,role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
}

exports.login = (req, res) => {
  const { email = false, password = false, role = false } = req.body;
  // Check All Field is filled or not
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Fill required fields" });
  }

  User.findOne({ email }).select("firstName lastName role password")
    .then((user) => {
      if (!user) {
        return res.status(400).json({ success: false, message: "User not Found" });
      }
      // Check password is same or not
      bcrypt.compare(password, user.password,
        function (err, bcryptRes) {
          if (bcryptRes) {
            const token = Token.create({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName });
            return res.status(200).json({ success: true, message: `Welcome ${user.firstName} ${user.lastName}`, token });
          }
          return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
      );
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ success: false, message: "There is some error please try again later" });
    });
};

exports.resetPassword = async (req, res) => {
  try {
    const { email = false } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "All input is required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not Exist" });
    }
    const token = Token.create({ id: user.id });
    sendResetPasswordMail({username:user.name, resetPasswordLink:`${process.env.FRONTEND_URL}/new-password/${token}`, email})
    return res.status(201).json({ success: true, message: `Check Your mail` });
  } catch (err) {
    console.log(err)
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
    }
    return res.status(400).json({ success: false, message: "There is some error please try again later" });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { password = false, confirmPassword = false } = req.body;
    if (!password || !confirmPassword) { return res.status(400).json({ message: 'Fill required fields' }); }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not Exist" });
    }
    const newPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_HASH));

    await User.findByIdAndUpdate(req.user.id, { password: newPassword });

    return res.status(201).json({ success: true, message: `Passwod successfullfy updated` });
  } catch (err) {
    console.log(err)
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
    }
    return res.status(400).json({ success: false, message: "There is some error please try again later" });
  }
};
