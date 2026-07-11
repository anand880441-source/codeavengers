const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow all origins for now
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://advisor-codeavenger.vercel.app',
    'https://advisor-frontend.vercel.app',
    'https://codeavengers.vercel.app',
    '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Advisor Backend API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      conversations: '/api/conversations',
      chat: '/api/chat/:id/messages',
      reports: '/api/reports'
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/api/health');
  console.log('Chat endpoint: http://localhost:' + PORT + '/api/chat/:id/messages');
});
