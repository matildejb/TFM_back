const express = require('express');
const cors = require('cors');
const dayjs = require('dayjs');
const fs = require('node:fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
 
 
const app = express();
app.use(express.json());
app.use(cors());

 
const corsOptions = {
  origin: 'http://localhost:4200', 
  methods: ['GET', 'PUT'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
app.get('/uploads/:profile_image', cors(corsOptions), (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    const imagePath = path.join(__dirname, 'uploads', req.params.profile_image);

    fs.access(imagePath, fs.constants.F_OK)
      .then(() => res.sendFile(imagePath))
      .catch(() => res.status(404).send('Image not found'));
  });
});

app.use('/api', require('./routes/api'));


 
module.exports = app;
