'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const index = require('./routes/index');
const path = require('path');
const cacheControl = require('./middleware/cache-control');
const getHaikus = require('./routes/getHaikus');
const getHaiku = require('./routes/getHaiku');
const putHaikus = require('./routes/putHaikus');
const getHaikusAuthors = require('./routes/getHaikusAuthors');
const getStatus = require('./routes/getStatus');

const routes = [index, getHaikus, getHaiku, putHaikus, getHaikusAuthors, getStatus];

const PORT = process.env.PORT || 7080;

function errorHandler(err, req, res, next) {
    if (err.isBoom) {
        const error = err.output.payload;
        res.status(error.statusCode || 500);
        res.json({
            message: error.message,
            error: error.error
        })
    } else {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    };
};

app.use(cacheControl());
app.use(bodyParser.json());
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);

const server = app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`)
});

module.exports = server;
