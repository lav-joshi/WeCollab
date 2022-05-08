const mongoose = require("mongoose");

const HackSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    trim: true,
  },
  finished:{
    type:Boolean,
    required: true
  },
  isHackathon: {
    type : Boolean,
    required : true
  },
  email : {
    type : String,
  },
  tags :[String],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Hack", HackSchema,);
