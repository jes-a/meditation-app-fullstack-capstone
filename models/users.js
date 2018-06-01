"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipCode: {
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
    type: {
        type: String,
        required: false
    },
    status: {
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

userSchema.virtual('fullName').
    get(function () {
        return this.firstName + ' ' + this.lastName;
    });

userSchema.virtual('fullAddress').
    get(function () {
        return this.address + ' ' + this.address2 + '</br>' +
        this.city + ', ' + this.state + ' ' + this.zipCode;
    });

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    address: this.address,
    address2: this.address2,
    city: this.city,
    state: this.state,
    zipCode: this.zipCode,
    fullAddress: this.fullAddress,
    phoneNumber: this.phoneNumber,
    email: this.email,
    type: this.type,
    status: this.status
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;