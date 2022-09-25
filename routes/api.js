const express = require("express");
const apiController = require("../controllers/apiController");
const passport = require("passport");

const router = express.Router();

router.post("/sign-in", apiController.signUpPost);

// get posts
router.get("/posts", apiController.postsGet);

// get single post
router.get("/posts/:id", apiController.singlePostGet);

// handle create post
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  apiController.postCreatePost
);

// handle create comment
router.post(
  "/posts/:id/create-comment",
  passport.authenticate("jwt", { session: false }),
  apiController.commentCreatePost
);

// handle post update
router.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  apiController.postUpdatePost
);

// handle post delete
router.delete(
  "posts/:id",
  passport.authenticate("jwt", { session: false }),
  apiController.postDeletePost
);

module.exports = router;
