const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ChatID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  SenderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Message: {
    type: String
  }
});
module.exports = mongoose.model('Message', messageSchema);
