const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
    nric: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    registeredAddress: {
        type: String,
        required: true
    },
    highestEduLevel: {
        type: String,
        required: true
    },
    grades: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Application', ApplicationSchema)