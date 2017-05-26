'use strict';

const connectionString = 'postgres://localhost/haikudb';

const knex = require('knex')({
    client: 'pg',
    connection: connectionString
});

module.exports = knex;
