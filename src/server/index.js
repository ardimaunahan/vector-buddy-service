const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const Parser = require('rss-parser');
const parser = new Parser();

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/index_files', express.static(path.join(__dirname + '/index_files')));
app.get('/', getRequestHandler);
app.post('*', postRequestHandler);

const httpServer = http.createServer(app);

httpServer.listen(7000, () => {
    console.log('HTTP Server running on port 7000');
});

// Use Cases
function postRequestHandler(req, res) {
    console.log(JSON.stringify(req.body));

    res.setHeader('Content-Type', 'application/json');
    let data = JSON.stringify({
        success: true
    });

    res.send(data);
}

async function getRequestHandler(req, res) {
    console.log(JSON.stringify(req.query));

    const productName = req.query.name || '';

    res.setHeader('Content-Type', 'application/json');

    let data = JSON.stringify({
        success: true
    });

    // console.log(data);

    res.send(data);
}
