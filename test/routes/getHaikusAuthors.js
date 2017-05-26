'use strict';

const request = require('supertest');
const assert = require('assert');
const server = require('../../index');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const haikus = require('../../models/haikus');

const authorsTestData = [{
        author: 'Yosa Buson',
        haikus: '1',
        last_active: '2 months ago'
    },
    {
        author: 'Basho Matsuo',
        haikus: '2',
        last_active: '3 days ago'
    }
]

describe('GET /haikus/authors', () => {
    beforeEach(() => {
        sandbox.stub(haikus, 'getAllAuthors').yields(null, authorsTestData);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('returns the haiku authors', (done) => {
        request(server)
            .get('/haikus/authors')
            .expect(200)
            .end((err, res) => {
                assert.ifError(err);
                assert.deepEqual(res.body.results, authorsTestData);
                done();
            });
    });

    it('returns the total number of haiku authors', (done) => {
        request(server)
            .get('/haikus/authors')
            .expect(200)
            .end((err, res) => {
                assert.ifError(err);
                assert.equal(res.body.total, "2");
                done();
            });
    });

    it('returns a 500 when retiving the haiku authors fails', (done) => {
        haikus.getAllAuthors.yields(new Error('snow crash'));
        request(server)
            .get('/haikus/authors')
            .expect(500, done);
    });
    describe('pagination', () => {
        it('supports pagination options', (done) => {
            request(server)
                .get('/haikus/authors?page=2&perPage=1')
                .expect(200)
                .end((err, res) => {
                    assert.ifError(err);
                    sinon.assert.calledWith(haikus.getAllAuthors, sinon.match({
                        page: "2",
                        perPage: "1"
                    }));
                    done();
                });
        });

        it('returns the page and perPage in the response', (done) => {
            request(server)
                .get('/haikus/authors?page=2&perPage=1')
                .expect(200)
                .end((err, res) => {
                    assert.ifError(err);
                    assert.strictEqual(res.body.page, "2");
                    assert.strictEqual(res.body.perPage, "1");
                    done();
                });
        });

        it('returns the default page and perPage in the response', (done) => {
            request(server)
                .get('/haikus/authors')
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
