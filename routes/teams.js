const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/authuser');
const Hackathon = require('../models/Hackathon');
const Room = require('../models/Room');

router.get("/chat",auth,(req,res)=>{
    User.findOne({email:req.user.email},(err,user)=>{
        let currentUser = req.user;
        currentUser.friends = user.friends;
        console.log(currentUser)
        res.render("teams",{currentUser});
    });
});

router.post('/getrooms', (req, res) => {
    if(!req.body.email){
        res.status(400).json({ 'rooms': [] })
        return;
    }
    User.findOne({ email: req.body.email }, async (err, user) => {
      let rooms = user.rooms
      res.status(200).json({ 'rooms': rooms })
    })
})

router.post('/room/addmember',async (req,res)=>{
    try{

        Room.findOne({ roomName: req.body.roomName }, async (err, room) => {
            User.findOne({email : req.body.email},async(err,user)=>{
                if(err) {
                    res.status(200).json({'msg' : 'Something went wrong'});
                    return;
                }

                if(!user || user===null || user===undefined)  {
                    res.status(200).json({'msg' : 'User does not exist'});
                    return;
                }
                if(!room)  {
                    res.status(200).json({'msg' : 'Something went wrong'});
                    return;
                }

                console.log(user)
                room.members.push({
                    name : user.name,
                    email: user.email
                })
                await room.save()
                user.rooms.push({
                    roomName: req.body.roomName,
                    roomId : room.id
                })
                await user.save()
                res.status(200).json({'msg' : 'Successfully added'});
            })
        })
    }catch(e){
        res.status(200).json({'msg' : 'Something went wrong'});
    }
})

router.post('/room/data',(req,res)=>{
    Room.findOne({roomName : req.body.roomName},async(err,room)=>{
        res.status(200).json({'roomData' : room});
    })
})

router.post('/createroom', async (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        const room = {
            roomName: req.body.room,
            ownerName : req.body.name,
            ownerEmail : req.body.email,
            members: [{
                name : req.body.name,
                email : req.body.email
            }],
            messages:[]
        }
        Room.create(room, async (err,newroom)=>{
            console.log(newroom)
            user.rooms.push({
                roomName : req.body.room,
                roomId : newroom.id
            })
            let rooms = user.rooms
            await user.save()
            res.status(200).json({'rooms' : rooms})
        })
    })
})


module.exports = router;

