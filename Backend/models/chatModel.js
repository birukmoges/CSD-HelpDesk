// models/chatModel.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  Client_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  Support_AgentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Support_Agent', required: true },
  Start_Time: { type: Date },
  End_Time: { type: Date },
  Message_Count: { type: Number },
  TicketID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
});
module.exports = mongoose.model('Chat', chatSchema);
