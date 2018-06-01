"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const boatSchema = new mongoose.Schema({
    boatName: {
        type: String,
        required: false        
    }, 
    boatMake: {
        type: String,
        required: false        
    }, 
    boatLength: {
        type: String,
        required: false        
    }, 
    boatAddress: {
        type: String,
        required: false       
    }, 
    boatAddress2: {
        type: String,
        required: false        
    }, 
    boatCity: {
        type: String,
        required: false        
    }, 
    boatState: {
        type: String,
        required: false        
    }, 
    boatZipCode: {
        type: String,
        required: false        
    }, 
    boatNotes: {
        type: String,
        required: false        
    }, 
    custFirstName: {
        type: String,
        required: false        
    }, 
    custLastName: {
        type: String,
        required: false        
    }, 
    custEmail: {
        type: String,
        required: false        
    },
    custPhone: {
        type: String,
        required: false        
    },
    custAddress: {
        type: String,
        required: false        
    },
    custAddress2: {
        type: String,
        required: false        
    },
    custCity: {
        type: String,
        required: false        
    },
    custState: {
        type: String,
        required: false        
    },
    custZipCode: {
        type: String,
        required: false        
    }
});

boatSchema.virtual('customerFullName').
    get(function () {
        return this.customerFirstName + ' ' + this.customerLastName;
    });

boatSchema.virtual('boatFullAddress').
    get(function () {
        return this.boatAddress + ' ' + this.boatAddress2 + '</br>' +
        this.boatCity + ', ' + this.boatState + ' ' + this.boatZipCode;
    });

boatSchema.virtual('custFullAddress').
get(function () {
    return this.custAddress + ' ' + this.custAddress2 + '</br>' +
    this.custCity + ', ' + this.custState + ' ' + this.custZipCode;
});

boatSchema.methods.serialize = function() {
  return {
    id: this._id,
    boatName: this.boatName,
    boatMake: this.boatMake,
    boatLength: this.boatLength,
    boatFullAddress: this.boatFullAddress,
    boatNotes: this.boatNotes,
    customerFullName: this.customerFullName,
    custEmail: this.custEmail,
    custPhone: this.custPhone,
    custFullAddress: this.custFullAddress
  };
};
const Boat = mongoose.model('Boat', boatSchema);

module.exports = Boat;