'use strict'; 

const express = require('express');
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const db = require('./db');

const PORT = 3500;

const app = express();

//logging middleware
app.use(volleyball);

//body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static middleware
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api')); // include our routes!


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}); // Send index.html for any other requests

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

// app.listen(PORT, (err) => {
//   if (err) throw err;
//   console.log(`Server listening on port ${PORT}`);
//   db.sync()
//   .then(() => {
//     console.log('Database has been successfully synced');
//   })
// })

module.exports = app;