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
      return res.status(200).json({ user });
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
      const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
      return res.json({ user, token });
    });
  })(req, res);
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

// get single post and comments
exports.singlePostGet = (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ post });
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
    // successful
    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ post });
    });
  },
];

// handle post update
exports.postUpdatePost = [
  body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    if (req.user) {
      const errors = validationResult(req);
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.user.id,
        date: req.body.date,
        _id: req.params.id,
        isPublished: req.body.publish,
        comments: req.body.comments,
      });
      if (!errors.isEmpty()) {
        return res.status(400).json({ post, message: "error updating post" });
      }
      Post.findByIdAndUpdate(post._id);
    } else {
      return res
        .status(403)
        .json({ message: "You do not have access to this page" });
    }
  },
];

// handle post delete
exports.postDeletePost = (req, res, next) => {
  if (req.user) {
    Post.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "success!" });
    });
  } else {
    res.status(403).json({ message: "You do not have access to this page" });
  }
};

// handle comments form
exports.commentCreatePost = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    if (req.user) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          content: req.body.content,
          message: "error creating comment",
        });
      }
      Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: {
            comments: {
              user: req.user.id,
              date: new Date(),
              content: req.body.content,
            },
          },
        },
        (err, post) => {
          if (err) {
            return next(err);
          }
          res.status(200).json({ post });
        }
      );
    } else {
      return res
        .status(403)
        .json({ message: "You do not have access to this page" });
    }
  },
];
