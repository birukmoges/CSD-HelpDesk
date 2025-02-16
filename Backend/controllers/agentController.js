//import ticket model from separate file
const ticket = require("../models/ticketModel");
const client = require("../models/clientModel");
const User = require ("../models/userModel");
const Email = require("../models/emailModel");
// const agent = require("../models/agentModel");
const nodemailer = require("nodemailer");
const SMTPTransport = require("nodemailer/lib/smtp-transport");
const user = require("../models/userModel");
const Notifications = require("../models/notificationModel");
const sendEmail = require("../utils/emailSender");

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.MAIL_ADD,
      pass: process.env.MAIL_PASS,
  },
});

const agentController = {

  closeTicket: async (req, res) => {  
    try {

      if (!req.body || !req.body.status || !req.body.resolutionDetails) {
        return res.status(400).json({ message: 'Invalid request body' });
      }
      const {ticketId} = req.query;
      // console.log(ticketId);
      const resolutionDetails = req.body.resolutionDetails;
      const tempTicket= await ticket.findOne({ _id: ticketId });
      const ticketOwner = tempTicket.Ticket_Owner;
      const Client = await user.findById(ticketOwner);
      const Agent = await user.findById(tempTicket.Assigned_AgentID);
      const end_date = new Date();
      // Find and update the ticket by its ID
      const updatedTicket = await ticket.findByIdAndUpdate(
        ticketId,
        { $set: { Status: "Closed", Resolution_Details: resolutionDetails , End_Date : end_date.getTime() } },
        { new: true } // Return the updated document
      );
        
      if (!updatedTicket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      console.log(Client.Email);
      ////////////////////////////// nofication email 


      const email = Client.Email;
      const to = tempTicket.Orgaization_Name;
      console.log(to);
      console.log(email.Email);

      const emailBody =
   `Hi ${to}'s Agent,
   We want to give you an update regarding the ticket you submitted. It has been resolved. If you have any further inquiries you can reach out to us.

   Best regards,
   CSD Support Team `;

  try {
    const response = await sendEmail(
      email, // Replace with recipient's email
      "Ticket resolved",
      emailBody
    );
    console.log("Email sent successfully: resolved", response);
    res.status(200).json({ message: "Email sent successfully", response });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }

      const newNotification = new Notifications({
        Sender: Agent._id,
        Receiver: Client._id,
        Message: "Your Ticket Has Been Closed, Check Your Email For More Details",
        Date: Date.now(),
      });
      await newNotification.save();
      
      return res.status(200).json(updatedTicket);
    } catch (e) {
      console.log("Could not close ticket", e.message);
      return res.status(400).send(e.message);
    }
  
  },
  getMyNotications: async (req, res) => {
    try {
        const { userID } = req.query; 
        const notifications = await Notifications.find({ Receiver: userID });
        if (!notifications) {
            return res.status(401).json({ message: "No Notifications Found"});
        }
        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
},

  updateTicket: async (req, res) => {
    try {
      const { status, message } = req.body;
      const ticketId = req.params.ticketId;

      const Ticket = await ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: { status: status, message: message } },
        { new: true }
      );
      if (!Ticket) {
        return res.status(404).json({ message: "Ticket Not Found" });
      } 
        const clientID = Ticket.Ticket_Owner;
        const Client = await client.findOne({ _id: clientID });

        if (!Client) {
          return res.status(404).json({ message: "Client Not Found" });
        }
        if(Client.Email == null) {
            return res.status(404).json({ message: "Client Email Not Found" });
          }
              var mailOptions = {
                from: "helpdesk.notis@gmail.com",
                to: Client.Email,
                subject: "Your Ticket Status Has Been Updated",
                text: message,
              };
              // transporter.sendMail(mailOptions, function (error, info) {
              //   if (error) {
              //     console.log(error);
              //   } else {
              //     console.log("Email sent: " + info.response);
              //   }
              // });
          
      res.status(200).json({ message: "Ticket Updated" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  sendEmail: async (req, res) => {
    try {
      const {ticketId, message, subject} =req.body;
      const Ticket = await ticket.findOne({_id: ticketId});
      if(!Ticket){
        return res.status(404).json({message: "Ticket Not Found"});
      }
      const clientID=Ticket.Ticket_Owner;
      const Client = await client.findOne({_id: clientID});
      if(!Client){
        return res.status(404).json({message: "Client Not Found"});
      }
      if(Client.Email==null){
        return res.status(404).json({message: "Client Email Not Found"});
      }
      const mailOptions ={
        from : process.env.MAIL_ADD,
        to: Client.Email,
        subject: subject,
        text: message,
      }
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
      });
      console.log(Ticket.Assigned_AgentID);
      console.log(Ticket.Ticket_Owner);
      console.log(1);

      const newEmail = new Email({ 
        Subject: subject,
        Body: message,
        Sender: Ticket.Assigned_AgentID,
        Recipient: Ticket.Ticket_Owner,
        Date: Date.now(),
      });

      console.log(2);

      // Save the newEmail to the database
      await newEmail.save();
  
      console.log(3)
      res.status(200).json({message: "Email Sent"});

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({message: "server error"});
    }
   
  },
  getTickets: async (req, res) => {
    try {
      const  agentId  = req.user.userId; // Use req.query to access query parameters
      if (!agentId){console.log("agent not found ");}
      console.log(agentId);
      const userName = await User.findById( agentId , "Username" );
      console.log(userName.Username);
      const tickets = await ticket.find({ Assigned_AgentName: userName.Username});
      // console.log(tickets)
      //const tickets = await ticket.find({ Assigned_AgentName: userName.Username , Status: { $ne: "Closed" }});
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ message: "No tickets found for the given agent" });
      }
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = agentController;