'use strict';

const fs = require('fs');
const path = require('path');
const petsDB = path.join(__dirname, 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

switch (cmd) {
    case 'read':
        read();
        break;
    case 'create':
        create();
        break;
    default:
        runErr();
}

function runErr() {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}

function create() {
    fs.readFile(petsDB, 'utf8', (err, data) => {
        if (err) throw err;
        const pets = JSON.parse(data);
        const age = Number(process.argv[3]);
        const kind = process.argv[4];
        const name = process.argv[5];
        if (!age || !kind || !name) {
            console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
            process.exit(1);
        } else {
            pets.push({age, kind, name});
            var petsJSON = JSON.stringify(pets);
        }
        fs.writeFile(petsDB, petsJSON, (writeErr) => {
            if (writeErr) throw writeErr;
            console.log({age, kind, name});
        });
    });
}

function read() {
    const indexParam = process.argv[3];
    if (indexParam) {
        fs.readFile(petsDB, 'utf8', (err, petsJSON) => {
            if (err) throw err;
            let pets = JSON.parse(petsJSON);
            if (!pets[indexParam]) {
                console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
            } else {
                console.log(pets[indexParam]);
            }
        });
    } else {
        fs.readFile(petsDB, 'utf8', (err, petsJSON) => {
            if (err) throw err;
            let pets = JSON.parse(petsJSON);
            console.log(pets);
        });
    }
}
