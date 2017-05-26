'use strict';

const request = require('supertest');
const server = require('../../index');
const assert = require('assert');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const haikus = require('../../models/haikus');

const haikusTestData = {
    id: 'haiku3',
    title: 'Snail',
    author: 'Kobayashi Issa',
    text: 'O snail Climb Mount Fuji, But slowly, slowly!',
    year_of_release: '1700-01-01',
    date_uploaded: '2017-04-21'
};

describe('PUT /haikus/id/:haikuId', () => {
    beforeEach(() => {
        sandbox.stub(haikus, 'save').yields(null, true);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('returns a 201 when a new haiku is created', (done) => {
        request(server)
            .put('/haikus/id/:haikuId')
            .send(haikusTestData)
            .expect(201)
            .end((err, res) => {
                assert.ifError(err);
                assert.deepEqual(res.body, haikusTestData);
                sinon.assert.calledWith(haikus.save, haikusTestData);
                done();
            });
    });

    it('returns a 200 when a haiku is updated', (done) => {
        haikus.save.yields(null, false);

        request(server)
            .put('/haikus/id/:haikuId')
            .send(haikusTestData)
            .expect(200, done);
    });

    it('returns a 500 when saving a haiku returns an error', (done) => {
        haikus.save.yields(new Error('pears'));

        request(server)
            .put('/haikus/id/:haikuId')
            .send(haikusTestData)
            .expect(500, done);
    });

    it('returns a 400 when the body is invalid', (done) => {

        request(server)
            .put('/haikus/id/:haikuId')
            .send({
                invalid: 'body'
            })
            .expect(400, done);
    });

});;
