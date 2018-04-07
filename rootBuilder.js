'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils/utils');

// utils.readDirectory()

const readAndWriteFile = (dir) => {
    return new Promise((resolve, reject) => {
        console.log(dir)
        let writeContent = JSON.parse(fs.readFileSync(dir).toString());
        // let reduced_content = ;
        resolve(writeContent.reduce((content, data) => {
            data['type'] = 'top-rated-movies';
            return [...content, data];
        }, []));
    }).catch((err) => {
        console.log({
            msg: err.message,
            stack: err.stack
        });
    });
}

let filePath = path.join(__dirname, 'data', 'movie', 'top-rated-movies-01.json')
readAndWriteFile(filePath).then(content => {
    fs.writeFile(filePath, JSON.stringify(content), (err) => {
        if (err) return console.log(err);
        console.log("The file was saved!");
    });
})