'use strict';

const request = require('supertest');
const assert = require('assert');
const server = require('../../index');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const haikus = require('../../models/haikus');

const haikusTestData = [{
        id: 'haiku1',
        title: 'Silence',
        author: 'Basho Matsuo',
        text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
        year_of_release: '1600-01-01',
        date_uploaded: '2017-04-21'
    },
    {
        id: 'haiku2',
        title: 'Silence',
        author: 'Basho Matsuo',
        text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
        year_of_release: '1600-01-01',
        date_uploaded: '2017-04-21'
    }
]

const haiku2 = [{
    id: 'haiku2',
    title: 'Silence',
    author: 'Basho Matsuo',
    text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
    year_of_release: '1600-01-01',
    date_uploaded: '2017-04-21'
}]

describe('GET /haikus', () => {
    beforeEach(() => {
        sandbox.stub(haikus, 'getAll').yields(null, haikusTestData);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('returns a list of haikus', (done) => {
        request(server)
            .get('/haikus')
            .expect(200)
            .end((err, res) => {
                assert.ifError(err);
                assert.deepEqual(res.body.results, haikusTestData);
                done();
            });
    });

    it('returns a list of haikus', (done) => {
        request(server)
            .get('/haikus')
            .expect(200)
            .end((err, res) => {
                assert.ifError(err);
                assert.equal(res.body.total, "2");
                done();
            });
    });

    it('returns a 500 when retrieving the haikus returns an error', (done) => {
        haikus.getAll.yields(new Error('bananas'));
        request(server)
            .get('/haikus')
            .expect(500, done);
    });

    describe('pagination', () => {
        it('supports pagination options', (done) => {
            request(server)
                .get('/haikus?page=2&perPage=1')
                .expect(200)
                .end((err, res) => {
                    assert.ifError(err);
                    sinon.assert.calledWith(haikus.getAll, sinon.match({
                        page: "2",
                        perPage: "1"
                    }));
                    done();
                });
        });

        it('returns the page and perPage in the response', (done) => {
            haikus.getAll.yields(null, haiku2);
            request(server)
                .get('/haikus?page=2&perPage=1')
                .expect(200)
                .end((err, res) => {
                    assert.ifError(err);
                    assert.strictEqual(res.body.page, "2");
                    assert.strictEqual(res.body.perPage, "1");
                    assert.deepEqual(res.body.results, haiku2);
                    done();
                });
        });

        it('returns the default page and perPage in the response', (done) => {
            request(server)
                .get('/haikus')
                .expect(200)
                .end((err, res) => {
                    assert.ifError(err);
                    assert.strictEqual(res.body.page, "1");
                    assert.strictEqual(res.body.perPage, "10");
                    done();
                });
        });
    });
});
