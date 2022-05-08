process.env.NODE_ENV = 'test'
let chai = require("chai");
let chaiHttp=require("chai-http");
const request = require("../routes/user")

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

 

describe('This test will give information about user', ()=>{
    //test GET /chats route
    it('/GET dashboard details', (done)=>{
        chai.request(server)
        .get("/dashboard")
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.an(object);
            res.should.have.property('currentUser');
            res.should.have.property('query');
            done();
        })
    })

    it('Not /GET dashboard details',(done)=>{
        chai.request(server)
        .get("/\dash")
        .end((err,res)=>{
            res.should.have.status(404);    
        })
        done();
    })

    //TEST dashboard edit profile
    it('edit pofile details',(done)=>{
        const id=1045;
        chai.request(server)
        .post("/dashboard/editprofile/")
        .send(id)
        .end((err,res)=>{
            res.should.have.status(200);
            done();
        })
    })


    it('Not edit pofile details',(done)=>{
        const id=1045;
        chai.request(server)
        .post("/dashboard/edit/")
        .send(id)
        .end((err,res)=>{
            res.should.have.status(404);
            done();
        })
    })


    it('edit pofile skills details',(done)=>{
        const id=1045;
        chai.request(server)
        .post("/dashboard/editprofile/skills")
        .send(id)
        .end((err,res)=>{
            res.should.have.status(200);
            done();
        })
    })

    it('give hackathons details',(done)=>{
        chai.request(server)
        .get("/hackathons")
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.have.property(title).have.property("type");
            res.should.have.property(start_date);
            res.should.have.property(end_date).have.property("type");
            res.should.have.property(link).should.be.an(object);
            done();
        })
    })

    it('delete user',(done)=>{
        const hackathonid=1;
        const userid=1045;
        chai.request(server)
        .delete('/hackathons/insert/'+hackathonid+'/'+userid)
        .end((err,res)=>{
            res.should.have.status(200);
        })
    })

    
    it('Not delete user',(done)=>{
        const hackathonid='IP';
        const userid=1045;
        chai.request(server)
        .delete('/hackathons/insert/'+hackathonid+'/'+userid)
        .end((err,res)=>{
            res.should.have.status(404);
        })
    })
})
