const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
  
  // Connect to MongoDB using Mongoose
  mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
      exportCollection();
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
    });
  
  // Define the Mongoose schema and model
  const userSchema = new mongoose.Schema({}, { strict: false }); // Adjust schema as needed
  const user = mongoose.model('users', userSchema);
  
  // Export function
  async function exportCollection() {
    try {
      const users = await user.find(); // Fetch all documents from the 'users' collection
      fs.writeFileSync('users.json', JSON.stringify(users, null, 2)); // Save to JSON file
      console.log('Data exported to users.json');
    } catch (err) {
      console.error('Error exporting collection:', err);
    } finally {
      mongoose.connection.close(); // Close the connection
    }
  }
  