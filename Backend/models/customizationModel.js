// customizationModel.js
const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  theme: { type: String, required: true },
  logoPath: { type: String },
});

module.exports = mongoose.model('Customization', customizationSchema);
