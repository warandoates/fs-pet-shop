'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const fsp = require('fs-promise');

const petsDB = path.join(__dirname, 'pets.json');



app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.json());


app.get('/pets', (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .then((petsDBData) => {
            let pets = JSON.parse(petsDBData);
            res.send(pets);
        })
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        });
});

app.get('/pets/:index', (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const pets = realPetsJson;
            let index = Number(req.params.index);
            if (index < 0 || index >= pets.length || Number.isNaN(index)) {
                return res.sendStatus(404);
            }
            res.set('Content-Type', 'application/json');
            res.send(pets[index]);

        });
});

app.post('/pets', (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const pets = realPetsJson;
            const name = req.body.name;
            const age = req.body.age;
            const kind = req.body.kind;

            if (name.length === 0 || age.length === 0 || kind.length === 0) {
                return res.sendStatus(400);
            }
            pets.push(req.body);
            res.send(req.body);
            return JSON.stringify(pets);
        })
        .then((updatedPetsJSON) => {
            fsp.writeFile(petsDB, updatedPetsJSON);
        })
        .catch((writeErr) => {
            console.error(writeErr.stack);
            return res.sendStatus(500);
        });
});

app.patch('/pets/:index', (req, res) => {
  fsp.readFile(petsDB, 'utf8')
  .catch((readErr) => {
    console.error(readErr.stack);
    return res.sendStatus(500);
  })
  .then((petsDBData) => {
    return JSON.parse(petsDBData);
  })
  .then((realPetsJson) => {
    const pets = realPetsJson;
    const index = Number(req.params.index);
    const pet = pets[index];
    const kind = req.body.kind;
    const name = req.body.name;
    const age = req.body.age;

    if (kind) {
      pet.kind = kind;
    }
    if (age) {
      pet.age = age;
    }
    if (name) {
      pet.name = name;
    }
    res.send(pet);
    return JSON.stringify(pets);
  })
  .then((updatedPetsJSON) => {
    fsp.writeFile(petsDB, updatedPetsJSON);
  })
  .catch((writeErr) => {
    console.error(writeErr.stack);
    return res.sendStatus(500);
  });
});

app.delete('/pets/:index', (req, res) => {
  fsp.readFile(petsDB, 'utf8')
  .catch((readErr) => {
    console.error(readErr.stack);
    return res.sendStatus(500);
  })
  .then((petsDBData) => {
    return JSON.parse(petsDBData);
  })
  .then((realPetsJson) => {
    const pets = realPetsJson;
    const index = Number(req.params.index);
    const deadPet = pets[index];
    pets.splice(index, 1);
    res.send(deadPet);
    return JSON.stringify(pets);
  })
  .then((updatedPetsJSON) => {
    fsp.writeFile(petsDB, updatedPetsJSON);
  })
  .catch((writeErr) => {
    console.error(writeErr.stack);
    return res.sendStatus(505);
  });
});


app.use((req, res) => {
    res.sendStatus(404);
});



app.listen(port, () => console.log("listening on port", port));

module.exports = app;
