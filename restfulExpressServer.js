'use strict';
// Dependencies
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fsp = require('fs-promise');
const basicAuth = require('basic-auth');

// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.json());

const petsDB = path.join(__dirname, 'pets.json');

// Authentication
function auth(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm="Required"');
        return res.sendStatus(401);
    }
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }
    if (user.name === 'admin' && user.pass === 'meowmix') {
        return next();
    } else {
        return unauthorized(res);
    }
}

app.get('/pets', auth, (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            const petsArr = JSON.parse(petsDBData);
            res.send(petsArr);
        });
});

// HTTP  MIDDLEWARE
app.get('/pets/:index', auth, (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const petsArr = realPetsJson;
            let index = Number(req.params.index);
            if (index < 0 || index >= petsArr.length || Number.isNaN(index)) {
                return res.sendStatus(404);
            }
            res.set('Content-Type', 'application/json');
            res.send(petsArr[index]);
        });
});

app.post('/pets', auth, (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const petsArr = realPetsJson;
            const name = req.body.name;
            const age = req.body.age;
            const kind = req.body.kind;

            if (name.length === 0 || age.length === 0 || kind.length === 0) {
                return res.sendStatus(400);
            }
            petsArr.push(req.body);
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

app.patch('/pets/:index', auth, (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const petsArr = realPetsJson;
            const index = Number(req.params.index);
            const pet = petsArr[index];
            const kind = req.body.kind;
            const name = req.body.name;
            const age = req.body.age;
            if (kind) pet.kind = kind;
            if (age) pet.age = age;
            if (name) pet.name = name;
            res.send(pet);
            return JSON.stringify(petsArr);
        })
        .then((updatedPetsJSON) => {
            fsp.writeFile(petsDB, updatedPetsJSON);
        })
        .catch((writeErr) => {
            console.error(writeErr.stack);
            return res.sendStatus(500);
        });
});

app.delete('/pets/:index', auth, (req, res) => {
    fsp.readFile(petsDB, 'utf8')
        .catch((readErr) => {
            console.error(readErr.stack);
            return res.sendStatus(500);
        })
        .then((petsDBData) => {
            return JSON.parse(petsDBData);
        })
        .then((realPetsJson) => {
            const petsArr = realPetsJson;
            const index = Number(req.params.index);
            const deadPet = pets[index];
            pets.splice(index, 1);
            res.send(deadPet);
            return JSON.stringify(petsArr);
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

// Port
app.listen(port);
console.log('Listening on port', port);

module.exports = app;
