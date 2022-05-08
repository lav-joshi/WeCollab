const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    members: [{
        name : String,
        email : String
    }],
    messages: [{
        senderName : String,
        message : String
    }]
});

module.exports = mongoose.model("rooms", RoomSchema);