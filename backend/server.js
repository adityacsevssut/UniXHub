const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const { errorHandler } = require('./middleware/errorMiddleware');

// Passport config
require('./config/passport')(passport);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser
app.use('/uploads', express.static('uploads'));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define Routes
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/graphic-design', require('./services/graphicDesign/routes'));
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/showcase', require('./routes/showcaseRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
