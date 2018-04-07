'use strict';

const fs = require('fs');
const path = require('path');
const httpRequest = require('request');

const ReadDirectory = async dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        if (isDirectory) {
            ReadDirectory(name)
        } else {
            files = files.concat(require(name));
            return files;
        }
    }, []);

const PostResponse = (url, body) => {
    return new Promise((resolve, reject) => {
        httpRequest.post(url, {
            json: body,
        }, (err, resp, body) => {
            if (err) reject(err);
            resolve(body);
        });
    });
};

const ReadAndWriteFile = (dir) => {
    return new Promise((resolve, reject) => {
        console.log(dir)
        let writeContent = JSON.parse(fs.readFileSync(dir).toString());
        resolve(writeContent.reduce((content, data) => {
            data['type'] = 'top-rated-movies';
            return [...content, data];
        }, []));
    }).then(content => {
        fs.writeFile(filePath, JSON.stringify(content), (err) => {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    }).catch((err) => {
        console.log({
            msg: err.message,
            stack: err.stack
        });
    });
};

const Validate_response = (response) => {
    return new Promise((resolve, reject) => {
        let data = response
        if (response && Object.keys(response).length > 0) {
            format_object(response).then((obj) => {
                resolve(obj);
            })
        } else {
            reject("response ids not valid");
        }
    })
}

const format_object = (playerResponse) => {
    return new Promise((resolve, reject) => {
        if (playerResponse) {
            for (let key in playerResponse) {
                if (key === "v" || key === "ttl") {
                    delete playerResponse[key]
                } else if (playerResponse[key] && typeof playerResponse[key] === "object") {
                    format_object(playerResponse[key])
                } else if (playerResponse[key] && typeof playerResponse[key] === "array" && playerResponse[key].length === 0) {
                    delete playerResponse[key];
                } else if (playerResponse[key] && typeof playerResponse[key] === "array" && playerResponse[key].length !== 0) {
                    format_object(playerResponse[key])
                } else if (playerResponse[key] === "" || playerResponse[key] === null || playerResponse[key] === undefined) {
                    delete playerResponse[key];
                }
            }
            resolve(playerResponse)
        } else {
            reject("RESPONSE IS EMPTY");
        }

    });
}

module.exports = {
    readAndWriteFile: ReadAndWriteFile,
    readDirectory: ReadDirectory,
    postResponse: PostResponse,
    validate_response: Validate_response
};