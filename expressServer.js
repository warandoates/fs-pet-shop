'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');

const path = require('path');
const petsDB = path.join(__dirname, 'pets.json');

app.disable('x-powered-by');

app.get('/pets', (req, res) => {
  fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
    if(readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(petsJSON);
    res.send(pets);
  });
});

app.get('/pets/:index', (req, res) => {
  fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
    if(readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    let index = Number(req.params.index);
    let pets = JSON.parse(petsJSON);
    if(index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(pets[index]);
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});



app.listen(port, () => console.log("listening on port", port));

module.exports = app;
