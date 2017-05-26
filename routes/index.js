'use strict';

const express = require('express');
const router = require('express').Router();
const pkg = require('../package');

router.get('/', (req, res) => {
    res.json({
        name: pkg.name,
        description: pkg.discription,
        version: pkg.version,
        documentation: 'http://localhost:3000/docs'
    });
});

module.exports = router;
