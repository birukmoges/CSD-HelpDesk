const mongoose = require('mongoose');
const { ObjectId } = mongoose;

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Username: { type: String, required: true },
    PhoneNumber: { type: String },
    RoleID: { type: Number },
    MFA_Enabled: { type: Boolean },
    theme: { type: String },
    logoPath: { type: String },
    salt :{type: String},
    Category : {type : String},
    verified: { type: Boolean, default: false  },
    is_valid: { type: Boolean, default: false },
  });

module.exports = mongoose.model('User', userSchema);
module.exports.Schema = userSchema; 
