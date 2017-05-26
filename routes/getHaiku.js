'use strict';

const router = require('express').Router();

const haikus = require('../models/haikus');

router.get('/haikus/id/:haikuId', (req, res, next) => {
    const haikuId = req.params.haikuId;

    haikus.get(haikuId, (err, haiku) => {
        if (err) return next(err);
        res.json(haiku);
    });
});

module.exports = router;
