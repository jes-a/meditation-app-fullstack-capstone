'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds245240.mlab.com:45240/meditation-tracker';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:demo123@ds245240.mlab.com:45240/meditation-tracker';
exports.PORT = process.env.PORT || 8080;