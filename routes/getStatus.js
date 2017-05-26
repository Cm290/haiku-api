'use strict';

const router = require('express').Router();

router.get('/status', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
