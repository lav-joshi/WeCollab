const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/authuser');
const Hackathon = require('../models/Hackathon');
const Room = require('../models/Room');

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/createEvent",(req,res)=>{
    // console.log(req.body);
    let eventObj = {
        title: req.body.title,
        start_date:  req.body.start_date,
        end_date:  req.body.end_date,
        link:  req.body.link,
        finished:false,
        isHackathon : false,
        email : req.user.email,
        tags: req.body.tags
    }
    console.log(eventObj)
    Hackathon.create(eventObj, async(err,event)=>{
        if(err) {
            console.log(err)
            res.send(err);
        } else{
            console.log('New Event created');
            res.redirect('/user/dashboard?section=organize');
        }
    })
});

module.exports = router;

