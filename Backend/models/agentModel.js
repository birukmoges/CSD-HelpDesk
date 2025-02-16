const mongoose = require('mongoose');

const supportAgentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Email: { type: String, ref: 'User', required: true },
    Password: { type: String, ref: 'User', required: true },
    Username: { type: String, ref: 'User', required: true },
    PhoneNumber: { type: String, ref: 'User' },
    RoleID: {type:Number, default:3},
    MFA_Enabled: { type: Boolean, ref: 'User' },
    Is_Enabled: { type: Boolean, ref: 'User' },
    Pref_Type: { type: String },
    Average_Rating: { type: Number },
    Ticket_Count: { type: Number },
    Category : {type : String},
    Active_Tickets: { type: Number },
    Salt : {type: String, ref: 'User'},
});
module.exports = mongoose.model('SupportAgent', supportAgentSchema);
module.exports.Schema = supportAgentSchema;
