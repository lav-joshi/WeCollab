process.env.NODE_ENV = 'test'
let chai = require("chai");
let chaiHttp=require("chai-http");
const request = require("../routes/friend")

chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

var express = require('express');
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



describe('This test will give information about friends in chat', ()=>{
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

    //TEST  ADDING A FRIEND ID
    it('Adding /ADD/id friend',(done)=>{
        chai.request(server)
        const id=1045
        .get("/chats/addfriend/"+id)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.an(object);
            res.should.have.property('name');
        })
    })

    it('Not Adding /ADD/id friend',(done)=>{
        chai.request(server)
        const id=1045
        .get("/chats/friend/"+id)
        .end((err,res)=>{
            res.should.have.status(404);
        })
    })
})
