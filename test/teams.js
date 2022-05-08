process.env.NODE_ENV = 'test'
let chai = require("chai");
let chaiHttp=require("chai-http");
const request = require("../routes/teams")

chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

var express = require('express');
const { getMaxListeners } = require("npm");
var app = express();
var Strategy;
 
if (process.env.NODE_ENV == 'test' ) {
  Strategy = require('passport-mock').Strategy;
} else {
  Strategy = require('passport-google').Strategy;
}
 
passport.use(new Strategy({
    name: 'google',
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  })
);


describe('This test will give information about chat teams', ()=>{
    //test GET /chats route
    it('/GET chats', (done)=>{
        chai.request(server)
        .get("/chats")
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.an(array);
            res.should.have.property('CurrentUser');
            res.should.have.property('friends');
            res.should.have.length.of(5);
            done();
        })
    })

    it('Not /GET chats',(done)=>{
        chai.request(server)
        .get("/nochats")
        .end((err,res)=>{
            res.should.have.status(404);    
        })
        done();
    })

    //TEST getrooms route
    it('Gives rooms associated with users',(done)=>{
        var mail='yadavashu4488@gmail.com'
        chai.request(server)
        .post("/getrooms")
        .send(mail)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.an(object);
            res.should.have.property('rooms');
            res.rooms.should.have.property('array');
            res.should.have.length(5);
            res.should.have.property('roomName');
            res.should.have.property('ownerName');
            res.should.have.property('ownerEmail');
            res.should.have.property('messages');
            res.should.have.property('messages').should.be.an('array');
            done();
        })
    })


    it('Gives no rooms associated with users',(done)=>{
            chai.request(server)
            .post("/getroomssss")
            .end((err,res)=>{
                res.should.have.status(404);
                done();
            })
    })

    //TEST room with one member adding
    it('Adding one member',(done)=>{
        var total={name:'Ashutosh',mail:'yadavashu@gmail.com'}
        chai.request(server)
        .post("/getrooms")
        .send(total)
        .end((err,res)=>{
            res.should.have.status(200);
        })
    })

    it('Not adding one member',(done)=>{
        var total={name:'Ashutosh',mail:'yadavashu@gmail.com'}
        chai.request(server)
        .post("/getroomsAdd")
        .send(total)
        .end((err,res)=>{
            res.should.have.status(404);
        })
    })

    
    it('Get room Name',(done)=>{
        var RoomName=Peaky_Coders
        chai.request(server)
        .post("/room/data")
        .send(RoomName)
        .end((err,res)=>{
            res.should.have.status(200);
        })
    })
   
    
    it('Not Get room Name',(done)=>{
        var RoomName=Peaky_Coders
        chai.request(server)
        .post("//room/info")
        .send(RoomName)
        .end((err,res)=>{
            res.should.have.status(404);
        })
    })
})


//TEST create room
it('Create a chat room',(done)=>{
    var total={
    roomName:     'Peaky_Coders',
    ownerName :   'Ashutosh',
    ownerEmail : 'yadavashu@gmail.com',
    members: [{
        name : 'Lav',
        email : 'lavjoshi@gmail.com'
    }],
    messages:[]
}

    chai.request(server)
    .post('/createroom')
    .send(total)
    .end((err,res)=>{
        res.should.have.status(200);
    })
})

