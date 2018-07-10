"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sessionSchema = new mongoose.Schema({
    loggedInUserId: {
        type: String,
        required: false
    },
    sessionDate: {
        type: String,
        required: false
    },
    sessionDateUnix: {
        type: Number,
        required: false       
    },
    sessionTime: {
        type: Number,
        required: false
    },
    sessionType: {
        type: String, 
        required: false
    }, 
    journalEntry: {
        type: String,
        required: false
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;