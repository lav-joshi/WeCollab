const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
// const keys = require("../config/keys");

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          user.accessToken.push(accessToken);
          await user.save();
          return done(err, user);
        } else if (!user) {
          const x = {
            email: profile.emails[0].value,
            displayPicture: profile.photos[0].value,
            name: profile._json.name,
            googleId: profile.id,
          };
          User.create(x, async (err, newUser) => {
            console.log(newUser);
            newUser.accessToken.push(accessToken);
            await newUser.save();
            return done(err, newUser);
          });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
