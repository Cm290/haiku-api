'use strict';

const cluster = require('cluster');

if (cluster.isMaster) {
    for (let i = 0; i < 7; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    require('./index');
}
