const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const FAQModel = require('./models/FAQModel.js');
require('dotenv').config();
// const userModel = require('./models/userModel');

// async function createAdminUser() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Connected to MongoDB');

//     // Define admin user details
//     const adminEmail = 'admin@new.com';
//     const adminPassword = 'secureAdminPassword321'; // Change this to a strong password
//     const adminUsername = 'AdminUser';

//     // Check if the admin already exists
//     const existingAdmin = await userModel.findOne({ Email: adminEmail });
//     if (existingAdmin) {
//       console.log('Admin user already exists');
//       return;
//     }
    
//     // Generate salt and hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(adminPassword, salt);

//     // Create admin user
//     const adminUser = new userModel({
//       _id : new mongoose.Types.ObjectId(),
//       Email: adminEmail,
//       Password: hashedPassword,
//       Username: adminUsername,
//       RoleID: 1, // Role ID for Admin
//       Is_Enabled: true, // Admin account is active by default
//       MFA_Enabled: false, // Enable or disable MFA as per your requirement
//       PhoneNumber: '123-456-7890', // Optional field
//       is_valid: true,
//       Salt: salt
//     });


//     await adminUser.save();

//     console.log('Admin user created successfully');
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   } finally {
//     // Close MongoDB connection
//     mongoose.connection.close();
//   }
// }



 // Seed FAQ data
 async function createAdminUser() {

  try {

    // Connect to MongoDB
   mongoose
     .connect(process.env.MONGODB_URI)
     .then(() => {
       console.log('Connected to MongoDB');
     })
     .catch((err) => {
       console.log(err);
     });

    console.log('Connected to MongoDB');

 const faqs = [

  { 
    Question: "How do I open a Central Securities System account?",
    Answer: "You need to visit a registered depository participant and submit the required KYC documents.",
    Category: "Account Management",
    Sub_Category: "Opening an Account",
 
  },
  {
    Question: "Can I transfer securities to another account?",
    Answer: "Yes, securities can be transferred by submitting a transfer form to your depository participant.",
    Category: "Transactions",
    Sub_Category: "Transfer of Securities",
  },


  {
    Question: "How do I submit a support ticket?",
    Answer: "To submit a support ticket, navigate to the 'Support' section in the application dashboard. Click on the 'Submit Ticket' button and fill out the required details, including the issue description. Once submitted, our support team will review and address your request promptly.",
    Category: "Ticket Submission",
    Sub_Category: "Process"
  },
  {
    Question: "What are the operating hours of the helpdesk?",
    Answer: "Our helpdesk operates from Monday to Friday, 9:00 AM to 5:00 PM local time. During these hours, you can reach out to our support team for assistance with any issues or inquiries related to the application.",
    Category: "Support Hours",
    Sub_Category: "Operating Time"
  },
  {
    Question: "How can I reset my password?",
    Answer: "If you need to reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and you will receive a password reset link via email. Follow the instructions in the email to create a new password for your account.",
    Category: "Account Management",
    Sub_Category: "Password Reset"
  },


  {
    Question: "How long does it typically take to resolve a support ticket?",
    Answer: "The resolution time for support tickets varies depending on the complexity of the issue and the current workload of our support team. However, we strive to resolve all tickets within 24 to 48 hours.",
    Category: "Ticket Resolution",
    Sub_Category: "Timeframe"
  },
  {
    Question: "Can I track the status of my support ticket?",
    Answer: "Yes, you can track the status of your support ticket directly from the application dashboard. Once logged in, navigate to the 'My Tickets' section.",
    Category: "Ticket Tracking",
    Sub_Category: "Tracking"
  },
  {
    Question: "How do I escalate a ticket if it's not resolved in a timely manner?",
    Answer: "If you feel that your support ticket is not being addressed adequately or within the expected timeframe, you can escalate the ticket by contacting our customer support manager directly via email or phone.",
    Category: "Ticket Escalation",
    Sub_Category: "Process"
  },

];



const savePromises  = faqs.map(async (faq) => {
  const newFaq = new FAQModel({
    Question: faq.Question,
    Answer: faq.Answer,
    Category: faq.Category,
    Sub_Category: faq.Sub_Category,
  });
  return await newFaq.save();
  
});
await Promise.all(savePromises);
  console.log ("successful");
}
catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      // Close MongoDB connection
      mongoose.connection.close();
    }
  }

createAdminUser();
