// Import required modules
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const socketIo = require('socket.io');
const path = require("path");
const fileUpload = require("express-fileupload");

const { uploadFile } = require("./middleware/uploadFile");


const Admin = require('./models/adminModel');


// Create the Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Enable CORS for all routes
// app.use(
//   cors({
//     origin: "http://localhost:4000",
//     credentials: true
//   })
// );

const allowedOrigins = ["http://localhost:5173", "http://10.20.220.45:4000" ,"https://10.20.220.187:4000" ,"https://192.168.137.1:4000" ]; // Add more allowed origins if needed

// app.use(
//   cors({
//     origin:'http://localhost:4000',
//     methods: ['GET', 'POST'],
//     credentials: true, // Allow cookies and authorization headers
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);



////file uploads 
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } })); // Enable file uploads, max file size 10MB
app.use("/uploads", express.static(path.join(__dirname, "files/uploads")));


// we don't need these to authenticate before access
const tempRouter = require('./routes/tempRoutes');
app.use(tempRouter);
app.use('/api/v1', authRouter);
app.use(authenticationMiddleware);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason);
});

// Import routes
const workflowRouter = require('./routes/workflowRoute');
const ticketRoutes = require('./routes/ticketRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const clientRoutes = require('./routes/clientRoutes');
const customizationRoute = require('./routes/customizationRoute');
const imageRoute = require('./routes/imageRoute');
const managerRoutes = require('./routes/managerRoutes');
const userRouter = require('./routes/userRoutes');
const logsRouter = require('./routes/logsRoutes');
const logger = require('./controllers/loggerController');
const FAQ = require('./models/FAQModel');

// Use the routes
app.use(ticketRoutes);
app.use(agentRoutes);
app.use(adminRoutes);
app.use(chatRoutes);
app.use(clientRoutes);
app.use(customizationRoute);
app.use(imageRoute);
app.use(managerRoutes);
app.use("/api/v1/users", userRouter);
app.use(authRouter);
app.use(logsRouter)
app.use('/api/tickets', ticketRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error });
  }
});

//Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(`Something broke! Error: ${err.message}`);
});

// Start the server

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle messages
  socket.on('sendMessage', (data) => {
    socket.broadcast.emit(`chat_${data.ticketId}`, {
      Message: data.message,
      SenderID: data.userId
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to add the admin entry
