'use strict';

const fs = require('fs');
const path = require('path');
const httpRequest = require('request');

const ReadDirectory = async dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(name)] : [...files, require(name)];
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

module.exports = {
    readDirectory: ReadDirectory,
    postResponse: PostResponse
};