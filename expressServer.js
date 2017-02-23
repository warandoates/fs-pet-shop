'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');

const path = require('path');
const petsDB = path.join(__dirname, 'pets.json');

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.json());


app.get('/pets', (req, res) => {
    fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
        if (readErr) {
            console.error(readErr.stack);
            return res.sendStatus(500);
        }
        let pets = JSON.parse(petsJSON);
        res.send(pets);
    });
});


app.post('/pets', (req, res) => {
    fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
        if (readErr) {
            console.error(readErr.stack);
            return res.sendStatus(500);
        }

        const pets = JSON.parse(petsJSON);

          let name = req.body.name;
          let age =  req.body.age;
          let kind = req.body.kind;

        if (name.length === 0 || age.length === 0 || kind.length === 0) {
          return res.sendStatus(400);
        }
        pets.push(req.body);
        let updatedPetsJSON = JSON.stringify(pets);

        fs.writeFile(petsDB, updatedPetsJSON, (writeErr) => {
            if (writeErr) {
                console.error(writeErr.stack);
                return res.sendStatus(500);
            }
            res.send(req.body);
        });
    });
});

app.get('/pets/:index', (req, res) => {
    fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
        if (readErr) {
            console.error(readErr.stack);
            return res.sendStatus(500);
        }
        let index = Number(req.params.index);
        let pets = JSON.parse(petsJSON);
        if (index < 0 || index >= pets.length || Number.isNaN(index)) {
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
