const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

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
