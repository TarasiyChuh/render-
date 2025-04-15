require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Дозволяємо лише конкретні домени (де твій фронтенд)
const allowedOrigins = [
  'https://versel-ashen.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // дозволяємо запити без origin (наприклад, з Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⛔ Блоковано CORS-запит з:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // якщо треба cookies, токени і т.п.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Підключення маршрутів
app.use('/api/auth', require('./routes/auth'));      // Аутентифікація та користувачі
app.use('/api/games', require('./routes/game'));
app.use('/api/comments', require('./routes/comment'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/library', require('./routes/library'));
app.use('/api/gemini-chat', require('./routes/gemini')); // Новий маршрут для Gemini

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
