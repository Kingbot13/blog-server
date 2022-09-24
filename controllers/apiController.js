const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// handle new user registration
exports.signUpPost = [
  body("username", "username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("confirm password must not be empty")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("passwords do not match")
    .escape(),
  body("firstName").escape(),
  body("lastName").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 8, (err, hash) => {
      const user = new User({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        isAdmin: false,
      });
      if (err) {
        return next(err);
      }
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "error registering user", user: user });
      }
      // successful
      user.save((err) => {
        if (err) {
          return next(err);
        }
      });
    });
  },
];
