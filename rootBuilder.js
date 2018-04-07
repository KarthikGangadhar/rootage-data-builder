'use strict';

const config = require('./utils/config');
const fs = require('fs');
const path = require('path');
const utils = require('./utils/utils');
const es = require('event-stream');
const ArrayStream = require('arraystream');

// let filePath = path.join(__dirname, 'data', 'movie');
// let moviesUrl = `${config.ROOTAGE_BASE_URL}${config.ROOATAGE_MOVIE_URL}`;
// utils.readDirectory(filePath).then((content) => {
//     console.log(content);
//     let stream = ArrayStream.create(content);
//     let contentaraay = [];
//     let csv_row_count = 0;

//     stream.on('data', (value, key) => {
//         stream.pause();
//         utils.validate_response(value).then((validData) => {
//             if(!validData.id){
//                 validData['id'] = key;
//             }
//             utils.postResponse(moviesUrl, validData).then(response => {
//                 console.log(JSON.stringify(response));
//                 stream.resume();
//             });
//         }).catch(err => {
//             console.log(err);
//         });
//         // console.log('value :', value); // hoge, fuga, piyo
//         console.log('key :', key); // 0,    1,    2
//         ++csv_row_count
//         console.log(`array count: ${csv_row_count} `);
//     });

//     stream.on('end', () => { // emitted at the end of iteration
//         console.log('end');
//     });

//     stream.on('error', (e) => { // emitted when an error occurred
//         console.log(e);
//     });
// });

let filePath = path.join(__dirname, 'data', 'prize');
let moviesUrl = `${config.ROOTAGE_BASE_URL}${config.ROOATAGE_PRIZE_URL}`;
utils.readDirectory(filePath).then((content) => {
    console.log(content);
    let stream = ArrayStream.create(content);
    let contentaraay = [];
    let csv_row_count = 0;

    stream.on('data', (value, key) => {
        stream.pause();
        utils.validate_response(value).then((validData) => {
            // if(!validData.id){
            //     validData['id'] = key;
            // }
            utils.postResponse(moviesUrl, validData).then(response => {
                console.log(JSON.stringify(response));
                stream.resume();
            });
        }).catch(err => {
            console.log(err);
        });
        // console.log('value :', value); // hoge, fuga, piyo
        console.log('key :', key); // 0,    1,    2
        ++csv_row_count
        console.log(`array count: ${csv_row_count} `);
    });

    stream.on('end', () => { // emitted at the end of iteration
        console.log('end');
    });

    stream.on('error', (e) => { // emitted when an error occurred
        console.log(e);
    });
});