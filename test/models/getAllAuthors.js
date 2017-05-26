'use strict';

const assert = require('assert');
const async = require('async');
const fs = require('fs');
const moment = require('moment');
const sinon = require('sinon');

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
    date_uploaded: '2017-05-07'
};

function generateHaiku(id, author, dateUploaded) {
    const haiku = Object.assign({}, haiku1, {
        id,
        author,
        date_uploaded: dateUploaded
    });
    return haiku;
};

const haiku2 = generateHaiku('haiku2', 'Yosa Buson', '2017-02-21');
const haiku3 = generateHaiku('haiku3', 'Basho Matsuo', '2017-02-21');

const authorsTestData = [{
        author: 'Yosa Buson',
        haikus: '1',
        last_active: '3 months ago'
    },
    {
        author: 'Basho Matsuo',
        haikus: '2',
        last_active: '4 days ago'
    }
]

const authorTestData = [{
    author: 'Basho Matsuo',
    haikus: '2',
    last_active: '4 days ago'
}]

describe('.getAllAuthors', () => {
    beforeEach((done) => {
        async.series([
            function flush(cb) {
                knex.schema
                    .raw(createSchema)
                    .asCallback(cb);
            },
            function insertHaiku(cb) {
                knex.queryBuilder()
                    .insert([haiku1, haiku2, haiku3])
                    .into('haikus')
                    .asCallback(cb);
            }
        ], done);
    });

    afterEach(() => {
        knexStub.restore();
        sinon.useFakeTimers().restore();
    });

    it('gets all the haikus authors', (done) => {
        sinon.useFakeTimers(new Date(2017, 4, 11).getTime(), "Date")

        haikus.getAllAuthors((err, allAuthors) => {
            assert.ifError(err);
            assert.deepEqual(allAuthors, authorsTestData);
            done();
        });
    });

    it('returns an error if the database returns an error', (done) => {
        knexStub.stub(new Error('Liftum and Shiftum'));

        haikus.getAllAuthors((err, allAuthors) => {
            assert.ok(err);
            assert.equal(err.message, 'Liftum and Shiftum');
            done();
        });
    });

    describe('pagination', () => {

        it('it supports both a perPage and a page parameter', (done) => {
            sinon.useFakeTimers(new Date(2017, 4, 11).getTime(), "Date")
            haikus.getAllAuthors({
                page: 2,
                perPage: 1
            }, (err, allAuthors) => {
                assert.ifError(err);
                assert.deepEqual(allAuthors, authorTestData);
                done();
            });
        });
    });
});
