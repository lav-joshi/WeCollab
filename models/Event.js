const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    regStartsAt :{
        type: Date,
        required: true
    },
    regEndsAt:{
        type: Date,
        required: true
    },
    organizerId: {
        type: String,
        required: true
    },
    typeOfEvent: {
        type: String,
        enum: ['technical', 'cultural'],
        default: 'technical'
    },
    description: {
        type: String,
    },
    urls: {
        coverImg: {
            type: String
        },
        website: {
            type: String,
            trim: true,
        },
        facebook: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("event", EventSchema);