"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
});

userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isValid) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};


userSchema.methods.serialize = function() {
  return {
    id: this._id,
    userName: this.userName,
    email: this.email,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;