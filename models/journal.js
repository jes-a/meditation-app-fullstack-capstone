"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const journalSchema = new mongoose.Schema({
    sessionDate: {
        type: Date,
        default: Date.now
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

const Journal = mongoose.model('Journal', userSchema);

module.exports = Journal;