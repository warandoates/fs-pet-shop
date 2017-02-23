'use strict';

const fs = require('fs');
const path = require('path');
const fsp = require('fs-promise');
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
    case 'update':
        update();
        break;
    case 'destroy':
        destroy();
        break;
    default:
        runErr();
}

function destroy() {
  fs.readFile(petsDB, 'utf8', (readErr, info) => {
      if (readErr) throw readErr;
      const pets = JSON.parse(info);
      const index = process.argv[3];
      if (!index) {
          console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
          process.exit(1);
      } else {

          let deadObj = pets[index];
          pets.splice(index, 1);
          console.log(deadObj);

          var petsJSON = JSON.stringify(pets);
      }
      fs.writeFile(petsDB, petsJSON, (writeErr) => {
          if (writeErr) throw writeErr;
      });
  });
}

    function read() {
        const indexParam = process.argv[3];
        if (indexParam) {
            fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
                if (readErr) throw readErr;
                let pets = JSON.parse(petsJSON);
                if (!pets[indexParam]) {
                    console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
                } else {
                    console.log(pets[indexParam]);
                }
            });
        } else {
            fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
                if (readErr) throw readErr;
                let pets = JSON.parse(petsJSON);
                console.log(pets);
            });
        }
    }

    function create() {
        fs.readFile(petsDB, 'utf8', (readErr, data) => {
            if (readErr) throw readErr;
            const pets = JSON.parse(data);
            const age = Number(process.argv[3]);
            const kind = process.argv[4];
            const name = process.argv[5];
            if (!age || !kind || !name) {
                console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
                process.exit(1);
            } else {
                pets.push({
                    age,
                    kind,
                    name
                });
                var petsJSON = JSON.stringify(pets);
            }
            fs.writeFile(petsDB, petsJSON, (writeErr) => {
                if (writeErr) throw writeErr;
                console.log({
                    age,
                    kind,
                    name
                });
            });
        });
    }

    function update() {
        fs.readFile(petsDB, 'utf8', (readErr, info) => {
            if (readErr) throw readErr;
            const pets = JSON.parse(info);
            const index = process.argv[3];
            const age = Number(process.argv[4]);
            const kind = process.argv[5];
            const name = process.argv[6];
            if (!index || !age || !kind || !name) {
                console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
                process.exit(1);
            } else {
                pets.splice(index, 0, {
                    age,
                    kind,
                    name
                });
                var petsJSON = JSON.stringify(pets);
            }
            fs.writeFile(petsDB, petsJSON, (writeErr) => {
                if (writeErr) throw writeErr;
                console.log({
                    age,
                    kind,
                    name
                });
            });
        });
    }

    function runErr() {
        console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
        process.exit(1);
    }