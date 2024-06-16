const express = require('express');
const cors = require('cors');
const dayjs = require('dayjs');
const fs = require('node:fs/promises');

const app = express();
app.use(express.json());
app.use(cors());



app.use('/api', require('./routes/api'));

module.exports = app;