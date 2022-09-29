const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const { ExtractJwt } = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
// jwt strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    (jwtPayload, done) => {
      // find user in db
      User.findById(jwtPayload.id, (err, user) => {
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      username: "email",
      password: "password",
    },
    (email, password, done) => {
      User.findOne({ username: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "incorrect email" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(err);
          }
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "incorrect password" });
          }
        });
      });
    }
  )
);
