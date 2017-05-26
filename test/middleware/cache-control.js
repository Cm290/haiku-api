'use strict';

const request = require('supertest');
const express = require('express');
const server = express();

const cacheControl = require('../../middleware/cache-control');


describe('cache-control header', () => {
    beforeEach(() => {

        server.use(cacheControl());

        server.get('/default', function(req, res) {
            res.sendStatus(200);
        });

        server.get('/error', function(req, res) {
            res.sendStatus(500);
        });

    });

    it('returns the default age cache-control header', (done) => {
        request(server)
            .get('/default')
            .expect(200)
            .expect('Cache-Control', 'max-age=60', done);
    });

    it('returns a max age cache-control header of 5 when there is an error', (done) => {
        request(server)
            .get('/error')
            .expect(500)
            .expect('Cache-Control', 'max-age=5', done);
    });

    it('returns a max age cache-control header of 5 when there is an error', (done) => {
        request(server)
            .get('/not-found')
            .expect(404)
            .expect('Cache-Control', 'max-age=10', done);
    });
});
