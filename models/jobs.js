"use strict";

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobName: {
        type: String,
        required: false
    },
    boatFullAddress: {
        type: String,
        required: false
    },
    services: {
        type: [String],
        required: false
    },
    otherService: {
        type: String,
        required: false
    },
    serviceDate: {
        type: String,
        required: false
    },
    assignTo: {
        type: [String],
        required: false
    },
    jobNotes: {
        type: String,
        required: false
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;