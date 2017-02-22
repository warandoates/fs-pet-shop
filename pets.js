'use strict';

const fs = require('fs');
const path = require('path');
const petsDB = path.join(__dirname, 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
let numOption = process.argv[3];


if (cmd === 'read' && numOption) {
    fs.readFile(petsDB, 'utf8', (err, petsJSON) => {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(petsJSON);
        if (pets[numOption]) {
            console.log(pets[numOption]);
        } else {
            console.error(`Usage: ${node} ${file} ${cmd} ${numOption}`);
        }
    });
} else if (cmd === 'read') {
    fs.readFile(petsDB, 'utf8', (err, petsJSON) => {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(petsJSON);
        console.log(pets);
    });
} else if(cmd === 'create') {
  fs.readFile(petsDB, 'utf8', (err, data) => {
      if (err) {
          throw err;
      }
    let pets = JSON.parse(data);
    let age = process.argv[3];
    let kind = process.argv[4];
    let name = process.argv[5];

    let petObj = {
      age: Number(age),
      kind: kind,
      name: name
    };

    if(!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    } else {
    pets.push(petObj);
    var petsJSON = JSON.stringify(pets);
}
    fs.writeFile(petsDB, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(petObj);
    });
  });
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
