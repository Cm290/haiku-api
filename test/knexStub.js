'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const knex = require('../lib/knex');

let sandbox;

module.exports.stub = (error, data) => {
    data = data || null;

    sandbox = sinon.sandbox.create();
    const stubbedKnex = {};
    const functions = _.keys(knex);
    functions.forEach((fn) => {
        stubbedKnex[fn] = sinon.stub().returnsThis();
    });

    stubbedKnex.asCallback = sinon.stub().yields(error, data);

    sandbox.stub(knex, 'queryBuilder').returns(stubbedKnex);
    sandbox.stub(knex, 'raw').returns(stubbedKnex);

    return stubbedKnex;
};

module.exports.restore = function() {
    if (sandbox) sandbox.restore();
};
