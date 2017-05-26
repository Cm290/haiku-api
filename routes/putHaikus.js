'use strict';

const express = require('express');
const router = require('express').Router();
const haikus = require('../models/haikus');
const Joi = require('joi');
const boom = require('boom');

const schema = Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    text: Joi.string().required(),
    year_of_release: Joi.date().required(),
    date_uploaded: Joi.date().required(),
});

router.put('/haikus/id/:haikusId', (req, res, next) => {
    const haiku = req.body;
    const valid = Joi.validate(haiku, schema);
    if (valid.error) {
        return next(boom.badRequest(valid.error.details.pop().message));
    };
    haikus.save(haiku, (err, created) => {
        if (err) return next(err);
        const resCode = created ? 201 : 200;
        res.status(resCode).json(haiku);
    });
});

module.exports = router;
