'use strict';

const assert = require('assert');
const request = require('supertest');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

const server = require('../../index');
const haikus = require('../../models/haikus');

const haikuTestData = {
    id: 'haiku3',
    title: 'Snail',
    author: 'Kobayashi Issa',
    text: 'O snail Climb Mount Fuji, But slowly, slowly!',
    year_of_release: '1700-01-01',
    date_uploaded: '2017-04-21'
};

describe('GET haikus/id/:haikuId', () => {
    beforeEach(() => {
        sandbox.stub(haikus, 'get').yields(null, haikuTestData);
    });

    afterEach(() => {
        sandbox.restore();
    });
    it('returns a 200 response', (done) => {
        request(server)
            .get('/haikus/id/haiku1')
            .expect(200, done);
    });

    it('returns a haiku', (done) => {
        request(server)
            .get('/haikus/id/haiku1')
            .expect(200)
            .end((err, res) => {
                assert.ifError(err);
                assert.deepEqual(res.body, haikuTestData);
                done();
            })
    });

    it('returns a 500 when retrieving the haiku returns an error', (done) => {
        haikus.get.yields(new Error('bananas'));
        request(server)
            .get('/haikus/id/haiku1')
            .expect(500, done);
    });
});
