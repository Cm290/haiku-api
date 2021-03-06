'use strict';

const assert = require('assert');
const async = require('async');
const fs = require('fs');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

const knex = require('../../lib/knex');
const haikus = require('../../models/haikus');
const knexStub = require('../knexStub');
const createSchema = fs.readFileSync('./sql/createSchema.sql').toString();

const releaseDateFormat = "to_char(year_of_release, 'YYYY-MM-DD') as year_of_release";
const uploadDateFormat = "to_char(date_uploaded, 'YYYY-MM-DD') as date_uploaded";
const datesToFormat = [releaseDateFormat, uploadDateFormat];
const dateFormat = datesToFormat.join(', ');

const haiku1 = {
    id: 'haiku1',
    title: 'Silence',
    author: 'Basho Matsuo',
    text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
    year_of_release: '1600-01-01',
    date_uploaded: '2017-04-21'
};

function generateHaiku(id) {
    const haiku = Object.assign({}, haiku1, {
        id
    });
    return haiku;
};
const haiku2 = generateHaiku('haiku2');

describe('.delete', () => {
    beforeEach((done) => {
        async.series([
            function flush(cb) {
                knex.schema
                    .raw(createSchema)
                    .asCallback(cb);
            },
            function insertHaiku(cb) {
                knex.queryBuilder()
                    .insert([haiku1, haiku2])
                    .into('haikus')
                    .asCallback(cb);
            }
        ], done);
    });
    afterEach(() => {
        knexStub.restore();
        sandbox.restore();
    });

    it('deletes a haiku from the database', (done) => {
        async.series([
            function saveHaiku(cb) {
                haikus.delete(haiku2, cb);
            },
            function checkSaved(cb) {
                knex.queryBuilder()
                    .select('*')
                    .from('haikus')
                    .column(knex.raw(dateFormat))
                    .asCallback((err, remainingHaikus) => {
                        assert.ifError(err);
                        assert.deepEqual(remainingHaikus, [haiku1]);
                        cb();
                    });
            }
        ], done);
    });

    it('does not give an error when the haiku to delete doesn\'t exist', (done) => {
        const haiku3 = generateHaiku('haiku3');
        async.series([
            function saveHaiku(cb) {
                haikus.delete(haiku3, cb);
            },
            function checkSaved(cb) {
                knex.queryBuilder()
                    .select('*')
                    .from('haikus')
                    .column(knex.raw(dateFormat))
                    .asCallback((err, remainingHaikus) => {
                        assert.ifError(err);
                        assert.deepEqual(remainingHaikus, [haiku1, haiku2]);
                        cb();
                    });
            }
        ], done);
    });

    it('returns an error if the database returns an error', (done) => {
        knexStub.stub(new Error('Liftum and Shiftum'));

        haikus.delete(haiku2, (err, results) => {
            assert.ok(err);
            assert.equal(err.message, 'Liftum and Shiftum');
            done();
        });
    });
});
