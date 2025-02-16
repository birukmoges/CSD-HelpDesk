const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel.js');
const adminModel = require('../models/adminModel.js');
const managerModel = require('../models/managerModel.js');
const agentModel = require('../models/agentModel.js');
const clientModel = require('../models/clientModel.js');
const Customization = require('../models/customizationModel');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const OTP = require('../models/otpModel.js');
const emailModel = require('../models/emailModel.js');
// Function to generate salt
// async function generateSalt() {
//   return bcrypt.genSalt(10); // 10 is the number of rounds for the salt generation
// }
// async function hashPassword(password, salt) {
//   try {
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
//   } catch (error) {
//     throw error;
//   }
// }

// const authentication = require('../middleware/authenticationMiddleware');
//  // Function to get user based on role
//  async function getUser(req, res) {
//     try {
//         const Token = req.header('Authorization');
//         const decoded = jwt.verify(Token, process.env.SECRET_KEY);

//     } catch (error) {
//         console.error('Error could not get user', error);
//         throw error;
//     }
// }
const sessionModel = require('../models/sessionModel.js');
const { Types } = require('mongoose');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADD,
    pass: process.env.MAIL_PASS
  }
});

const userController = {
  registerUser: async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    console.log(1);
    if (!username || !email || !password || !phoneNumber) {
      res.status(400);
      throw new Error('Please add your name, email, phone number, and password');
    }
    console.log(2);

    const userExists = await userModel.findOne({ Email: email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const lastUser = await userModel.findOne({}, {}, { sort: { _id: -1 } }); // Find the last user
    // const lastId = lastUser ? lastUser._id : 0; // Get the last _id or default to 0 if no user exists
    const newId = new mongoose.Types.ObjectId() ; // Increment the last _id
    
    const user = await userModel.create({
     _id: newId,
      Email: email,
      Password: hashedPassword,
      Username: username,
      PhoneNumber: phoneNumber,
      Salt: salt,
      MFA_Enabled: false,
      RoleID: 4,
      is_valid: true
    });

    const Client = await clientModel.create({
     _id: user._id,
      Email: user.Email,
      Password: user.Password,
      Username: user.Username,
      PhoneNumber: user.PhoneNumber,
      Salt: user.salt,
      RoleID: user.RoleID,
      is_valid: true
    });

    await Client.save();
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.Username,
        email: user.Email,
        success : "success",
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
   //   alert(`${user.Username} registered succesfully`);

    }
  },

  loginUser: async (req, res) => {
    const { email, password, code } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const user = await userModel.findOne({ Email: email }).select('+Password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (!user || !user.Password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Check if user.Password is defined and not null
      if (!user.Password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 7200000 ); // expire in 30 minutes

      const token = jwt.sign({ user: { userId: user._id, role: user.RoleID, username: user.Username } },process.env.JWT_SECRET, {
        expiresIn: 3 * 60 * 60 // 3 hours
      });
      if (!mongoose.Types.ObjectId.isValid(user._id)) {
        console.log("invalid use id ");
        return res.status(500).json({ message: 'Invalid user ID' });
      }else{
        console.log("valid user id ");
      }

      let newSession = new sessionModel({
        userId: new Types.ObjectId(user._id),
        token,
        expiresAt: expiresAt
      });
      await newSession.save();
      return res
        .cookie('token', token, {
          expires: expiresAt,
          withCredentials: true,
          httpOnly: false,
          SameSite: 'none'
        })
        .status(200)
        .json({ message: 'login successfully', user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // View user profile
  viewUserProfile: async (req, res) => {
    try {
      const _id = req.user.userId; // Use req.user.id to get the user ID from the decoded token
      const user = await userModel.findById(_id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.userId; // Use req.user.id to get the user ID from the decoded token
      const { newEmail, newUsername, newPhoneNumber } = req.body;

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.Email = newEmail || user.Email;
      user.Username = newUsername || user.Username;
      user.PhoneNumber = newPhoneNumber || user.PhoneNumber;

      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const userEmail = req.body.email;
      const password = req.body.password;
      const user = await userModel.findOne({ Email: userEmail });
      console.log(user);
      console.log(` reset user password ${password}`);
      console.log(password);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }else{
        console.log(user)
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
     
      await userModel.updateOne(
        { Email: userEmail }, // Filter
        { $set: { Password: hash, salt: salt } } // Update
      );
      res.status(200).json({ message: 'Password reset successfully' });
      console.log("passowrd reset succcessfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // change password
  renewPassword: async (req, res) => {
    try {
      const userEmail = req.body.email;
      const password = req.body.password;
      const user = await userModel.findOne({ Email: userEmail });
      console.log(` reset user password ${password}`);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }else{
        console.log(user)
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
     
      await userModel.updateOne(
        { Email: userEmail }, // Filter
        { $set: { Password: hash, salt: salt } } // Update
      );
      res.status(200).json({ message: 'Password reset successfully' });
      console.log("passowrd reset succcessfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Set MFA get request
  setMFA: async (req, res) => {
    try {
      const { id } = req.body;
      const user = await userModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.MFA_Enabled === false) {
        await userModel.updateOne({ _id: id }, { $set: { MFA_Enabled: true } });
      } else {
        await userModel.updateOne({ _id: id }, { $set: { MFA_Enabled: false } });
      }
      console.log('Email sent successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logoutUser: async (req, res) => {
    try {
      // Clear the JWT cookie
      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
      await userModel.updateOne({ _id: req.user.id }, { $set: { verified: false } });
      res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUserCustomization: async (req, res) => {
    try {
      const userId = req.params._id;
      const { theme, logoPath } = req.body;

      // Update or create customization settings for the user
      await Customization.findOneAndUpdate({ userId }, { $set: { theme, logoPath } }, { upsert: true, new: true });

      // Update the user's theme in the user model
      await userModel.findOneAndUpdate({ _id: userId }, { $set: { theme } }); // Update this line

      res.status(200).json({ message: 'Customization updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getMFA: async (req, res) => {
    const { email } = req.query;
    try {
      console.log(email);
      console.log('Received email:', email); // Add this line for debugging
      const user = await userModel.findOne({ Email: email });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: "User is new or hasn't been found" });
      }

      console.log('User found. MFA Enabled:', user.MFA_Enabled);
      return res.status(200).json(user.MFA_Enabled);
    } catch (error) {
      // console.error("Error in getMFA:", error.message);
      console.log('lol L');
      return res.status(500).json({ message: error.message });
    }
  },

  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(`Received request to send OTP for email: ${email}`);
  
      // Delete existing OTP if any
      await deleteOTP(email);
      console.log(`Deleted existing OTP for email: ${email}`);
  
      const OneTimePass = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = await bcrypt.hash(OneTimePass, 10);
      console.log(`Generated OTP: ${OneTimePass}`);
  
      const newOTP = new OTP({
        email: email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiredAt: Date.now() + 1 * 60 * 1000
      });
  
      // Email configuration
      var mailOptions = {
        from: process.env.MAIL_ADD,
        to: email,
        subject: 'Verify your email',
        text: 'Please click the link below to enable Multi-factor authentication',
        html: `<p>${OneTimePass}</p>`
      };
  
      // Sending email
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(`Error sending email: ${error}`);
      //     res.status(500).json({ message: 'Failed to send OTP email' });
      //   } else {
      //     console.log(`Email sent successfully: ${info.response}`);
      //   }
      // });
  
      // Save new OTP to the database
      await newOTP.save();
      console.log('New OTP saved to the database');
  
      res.status(200).json({ message: 'Multi-factor authentication email sent successfully' });
    } catch (error) {
      console.log(`Error in sendOTP: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },
  
  verifyOTP: async (req, res) => {
    try {
      const { email, code } = req.body;
      console.log(email, code);

      const user = await userModel.findOne({ Email: email });
      const validOTP = await verifyOTP(email, code);
      if (!validOTP) {
        throw new Error('Invalid OTP');
      }

      await deleteOTP(email);
      if (user) {
        await userModel.updateOne({ Email: email }, { verified: true });
      }
      return res.status(200).json({ message: 'Multi-factor authentication email sent successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // getUser: async (req,res) => {
  //     // split from token= to the first . and get the second part
  //     // console.log(req.headers.cookie.split('token=')[1]);
  //     const token = req.headers.cookie.split('token=')[1];

  //     if (!token) {
  //       return res.status(401).json({ message: 'No token, authorization denied' });
  //     }

  //     let payload = null;

  //     try {
  //         payload = jwt.verify(token, process.env.JWT_SECRET);
  //     } catch (err) {
  //         return res.status(401).json({ message: 'Token is not valid' });
  //     }

  //     const user = await userModel.findById(payload.id);
  //     // console.log(user)

  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     return user;
  //   }

  // verifyOTPforLogin: async (req, res) => {
  //   try {
  //     const { email,code } = req.body;
  //     console.log(email,code);
  //     const validOTP = await verifyOTP(email,code);

  //       if(!validOTP){
  //           throw Error("Invalid OTP")
  //       }
  //       await userModel.updateOne({Email:email},{verified:true});
  //       await deleteOTP(email);

  //     res.status(200).json({ message: 'Multi-factor authentication email sent successfully' });
  //   }catch (error) {
  //       res.status(500).json({ message: error.message });
  //   }
  // },
};
const verifyOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      throw Error('Provide values for Email and/or OTP');
    }
    console.log(5);
    const matchedOTPRecord = await OTP.findOne({ email: email });
    console.log(6);
    if (!matchedOTPRecord) {
      throw Error('Invalid OTP');
    }
    console.log(7);
    const { expiresAt } = matchedOTPRecord;
    console.log(8);
    if (expiresAt < Date.now()) {
      console.log(9);
      await OTP.deleteOne({ email: email });
      console.log(10);
      throw Error('OTP expired, request a new one.');
    }
    const hashedOTP = matchedOTPRecord.otp;
    console.log(11);
    const validOTP = bcrypt.compare(otp, hashedOTP);
    console.log(12);
    return validOTP;
  } catch (error) {
    throw error;
  }
};
const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email: email });
  } catch (error) {
    throw error;
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { userController };
