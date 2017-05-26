'use strict';

const onHeaders = require('on-headers');

module.exports = function cacheControlConstructor() {

    return function cacheControl(req, res, next) {

        onHeaders(res, function() {
            let routeConfig = {
                maxAge: 60
            };

            if (res.statusCode >= 500) {
                routeConfig = {
                    maxAge: 5
                };
            }

            if (res.statusCode === 404) {
                routeConfig = {
                    maxAge: 10
                };
            }

            if (!res.getHeader('Cache-Control')) {
                res.setHeader('Cache-Control', `max-age=${routeConfig.maxAge}`);
            };
        });
        next();
    }
}
