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

exports.logInPost = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "error logging in user",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed token with contents of user obj and return token
      const token = jwt.sign(user, "cool_beans");
      return res.json({ user, token });
    });
  });
};

// get posts and comments
exports.postsGet = (req, res, next) => {
  Post.find().exec((err, posts) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ posts });
  });
};

// handle create post
exports.postCreatePost = [
  body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      author: req.user.id,
      isPublished: req.body.publish || false,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ post, message: "error creating post" });
    }
    if (!req.user) {
      return res
        .status(400)
        .json({ post, message: "error: no signed in user" });
    }
    // successful
    post.save((err) => {
      if (err) {
        return next(err);
      }
    });
  },
];
