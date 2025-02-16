const mongoose = require("mongoose");
const Client = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Agent = require("../models/agentModel");
const Chat = require("../models/chatModel");
const axios = require("axios");
const { getUser } = require("../controllers/userController");
const { PriorityQueue } = require("../utils/PriorityQueue");
const sendEmail = require("../utils/emailSender");
const { uploadFile } = require("../middleware/uploadFile"); // Import the uploadFile function


const clientController = {

  getMyTickets: async (req, res) => {
    const _id = req.user.userId;
    // console.log(_id)
    try {
      const client = await Client.findById(_id);
      if (!client) {
        return res.status(404).json({ error: "client not found" });
      }
      const tickets = await Ticket.find({ Ticket_Owner: _id });
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  
  createTicket: async (req, res) => {
    try {
      const _id = req.user.userId;
      console.log(_id);
      const user = await Client.findById(_id);
      console.log(user.id);

      const requestedIssueType = req.body.Issue_Type;
      const requestedIssueOrganization = req.body.organization_name;
      let uploadedImage = "";
      let uploadedFile = "";

       ///// File upload logic
    try {
      const uploadedFiles = await uploadFile(req, "uploads");

      if (uploadedFiles.image) {
        uploadedImage = uploadedFiles.image; // Path of uploaded image
      }else{
        uploadedImage = "";
      }

      if (uploadedFiles.pdf) {
        uploadedFile = uploadedFiles.pdf; // Path of uploaded PDF
      }else{
        uploadedFile = "";
      }
    } catch (error) {
      console.error("File upload error:", error.message);
      return res.status(400).json({ error: "File upload failed" });
    }
      
    
      ///////////////////  assigning agent

      const agent = await Client.findOne({
        RoleID: 3,
        Category: requestedIssueType,
      });
      if (agent) {
        console.log(agent);
      }
      console.log(requestedIssueType);

      // Check if the client exists
      const client = await Client.findById(user);
      if (!client) {
        console.log("client not found");
        return res.status(404).json({ error: "client not found" });
      }
      const currentDate = new Date();
      const newTicketId = new mongoose.Types.ObjectId(); // Increment the last _id
      const newTicket = new Ticket({
        _id: newTicketId,
        Orgaization_Name: requestedIssueOrganization,
        Status: "Open",
        Assigned_AgentName: agent.Username, // cannot be null
        Ticket_Owner: user,
        Issue_Type: requestedIssueType,
        Description: req.body.description,
        Priority: null,
        Resolution_Details: null,
        Rating: null,
        Start_Date: currentDate.getTime(),
        End_Date: null, // needs a function close ticket
        // Sub_Issue_Type: req.body.Sub_Issue_Type,
        Upload_Image: uploadedImage,
        Upload_File: uploadedFile,
      });
      newTicket.save();


      ///////////////// ticket sumbitted email

          const email = await Client.findById(user.id, "Email");
          const to = newTicket.Orgaization_Name;
          console.log(email.Email);

          const emailBody = `Hi ${requestedIssueOrganization}'s Agent,
       Thank you for reaching out to us! We want to let you know your ticket has been received.
       We will provide you with an update regarding your ticket as soon as it gets resolved.
       Best regards,
       CSD Support Team `;

      try {
        const emailPromise1 = await sendEmail(email, "Ticket received", emailBody);
        console.log("Email sent successfully no need to check inbox");



      ///////////////  agent email

    const AgentEmailBody = `Hi ${agent.Username},

    You have been assigned a new ticket regarding ${requestedIssueType}.
    Please review the details and take the necessary actions. If you have any questions or need further assistance, feel free to reach out.
    Thank you for your attention!
    
    Best regards,
    CSD Support Admin`;
        const agentEmail = agent.Email;
        console.log(agentEmail);
        const emailPromise2 = await sendEmail(
          agentEmail, // Replace with recipient's email
          "Ticket received",
          AgentEmailBody
        );

        await Promise.all([emailPromise1, emailPromise2]);
        console.log("Email sent successfully:");
        res.status(200).json({ message: "Email sent successfully" });
      } catch (error) {
        console.error("Error:", error.message);
        res
          .status(500)
          .json({ message: "Failed to send email", error: error.message });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }













,
  rateAgent: async (req, res) => {
    try {
      const _id = req.user.userId;
      const client = await Client.findById(_id);
      if (!client) {
        return res.status(404).json({ error: "client not found" });
      }

      const ticketId = req.body.ticketId;
      const rating = parseInt(req.body.Rating); // Convert the rating to an integer
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating value" });
      }

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket does not exist" });
      }

      if (ticket.Status !== "Closed") {
        return res
          .status(400)
          .json({ error: "This ticket is not closed yet and cannot be rated" });
      }

      // Get the agent id from the ticket
      const agentId = ticket.Assigned_AgentID;

      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      // Update the agent's avg rating
      // Check for zero ticket count to avoid division by zero
      if (agent.Ticket_Count === 0) {
        agent.Average_Rating = rating;
      } else {
        agent.Average_Rating =
          (agent.Average_Rating * agent.Ticket_Count + rating) /
          (agent.Ticket_Count + 1);
      }

      await agent.save();
      res.json({ message: "Agent rated successfully", agent });
    } catch (error) {
      console.error("Error Inserting Rating:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = clientController;
