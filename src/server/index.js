const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', getRequestHandler);
app.post('*', postRequestHandler);

const httpServer = http.createServer(app);

let port = 8889;
httpServer.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});

function _makeProgramToExecute(options) {
    const {spawn} = require('child_process');
    console.log(options);

    let pyprog = '';
    let scriptName = '';
    switch (options.command) {
        case 'SAY_TEXT':
            scriptName = path.join(__dirname + '/../py-scripts/say-text.py');
            pyprog = spawn('python', [scriptName, `"${options.params}"`]);

            break;
        case 'CHECK_BATTERY':
            scriptName = path.join(__dirname + '/../py-scripts/check-battery.py');
            pyprog = spawn('python', [scriptName]);

            break;
        default:
            throw new Error('Invalid command');
    }

    return pyprog;
}

async function getRequestHandler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let data = JSON.stringify({
        status: 'error',
        result: 'GET method is not supported'
    });

    res.send(data);
}

async function postRequestHandler(req, res) {
    console.log(JSON.stringify(req.body.request));

    const command = req.body.command || '';
    const params = req.body.params || '';

    let cmdResult = '';
    let finalResult = null;
    let cmdCode = '';
    await new Promise(function(resolve, reject) {
        try {
            const pyprog = _makeProgramToExecute({command, params});

            pyprog.stdout.on('data', data => {
                console.log(`Success: ${data}`);

                cmdResult += data + '\n';
            });

            pyprog.stderr.on('data', data => {
                console.log(`Error inside Promise: ${data}`);

                cmdResult += data + '\n';
            });

            pyprog.on('close', code => {
                console.log(`Child process exited with code ${code}`);
                cmdCode = code;
                reject({
                    code,
                    output: cmdResult
                });
            });
        } catch (e) {
            reject({
                output: e.message
            });
        }
    })
        .then(function(result) {
            console.log('Finished running, success');
            finalResult = result;
        })
        .catch(function(result) {
            console.log('Finished running, error');
            finalResult = result;
        });

    res.setHeader('Content-Type', 'application/json');
    let data = JSON.stringify({
        status: 'success',
        result: finalResult
    });

    res.send(data);
}
