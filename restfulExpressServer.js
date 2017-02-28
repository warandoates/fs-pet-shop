'use strict';
// Dependencies
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fsp = require('fs-promise');
const basicAuth = require('basic-auth');

// express
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.json());

const petsDB = path.join(__dirname, 'pets.json');

function petsReader() {
    return fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        });
}

// petsDB -read, write and routes authentication functions
function petsWriter(modifiedJSON) {
    return fsp.writeFile(petsDB, modifiedJSON)
        .catch((writeErr) => {
            console.error(writeErr.stack);
            return res.sendStatus(500);
        });
}

let auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm="Required"');
        return res.sendStatus(401);
    };
    let user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    if (user.name === 'admin' && user.pass === 'meowmix') {
        return next();
    } else {
        return unauthorized(res);
    };
};

// middleWare and httpMethod requests
app.use(auth, (req, res, next) => {
    next();
});

app.get('/pets', (req, res) => {
    petsReader()
        .then((pets) => {
            res.send(pets);
        });
});

app.get('/pets/:index', (req, res) => {
    fsp.readFile(petsDB, 'utf8')
    petsReader()
        .then((realPetsJson) => {
            const pets = realPetsJson;
            let index = Number(req.params.index);
            if (index < 0 || index >= pets.length || isNaN(index)) {
                return res.sendStatus(404);
            }
            res.send(pets[index]);
        });
});

app.post('/pets', (req, res) => {
    petsReader()
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
            let updatedPet = JSON.stringify(pets);
            petsWriter(updatedPet);
        });
});

app.patch('/pets/:index', (req, res) => {
    petsReader()
        .then((realPetsJson) => {
            const pets = realPetsJson;
            const index = Number(req.params.index);

            if (index < 0 || index >= pets.length || isNaN(index)) {
                return res.sendStatus(404);
            }

            const pet = pets[index];
            const kind = req.body.kind;
            const name = req.body.name;
            const age = req.body.age;

            if (kind) pet.kind = kind;
            if (age) pet.age = age;
            if (name) pet.name = name;

            res.send(pet);
            let updatedPet = JSON.stringify(pets);
            petsWriter(updatedPet);
        });
});

app.delete('/pets/:index', (req, res) => {
    petsReader()
        .then((realPetsJson) => {
            const pets = realPetsJson;
            const index = Number(req.params.index);
            if (index < 0 || index >= pets.length || isNaN(index)) {
                return res.sendStatus(404);
            }
            const deadPet = pets[index];
            pets.splice(index, 1);
            res.send(deadPet);
            let updatedPet = JSON.stringify(pets);
            petsWriter(updatedPet);
        });
});

app.use((req, res) => res.sendStatus(404));
app.listen(port, () => console.log("listening on port", port));

module.exports = app;
