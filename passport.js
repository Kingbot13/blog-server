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
    (email, password, done) => {}
  )
);
