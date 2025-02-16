const { Schema, model } = require('mongoose');


const ticketSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    Orgaization_Name :{type : String},
    Status: { type: String },
    Assigned_AgentName: { type: String, ref: 'Support_Agent', required: false },
    Ticket_Owner: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    Issue_Type: { type: String },
    Description: { type: String, trim: true,},
    Priority: { type: String },
    Resolution_Details: { type: String },
    Start_Date : {type: Date},
    End_Date : {type: Date},
   // Sub_Issue_Type: { type: String, required: true },
    Upload_Image : {type : String, default: "" ,  required: false},
    Upload_File : {type : String ,default: "" , required: false},

  });

  const Ticket = model('Ticket', ticketSchema);
  module.exports = Ticket;

