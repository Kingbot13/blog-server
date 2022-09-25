const express = require("express");
const apiController = require("../controllers/apiController");

const router = express.Router();

router.post("/sign-in", apiController.signUpPost);

// get posts
router.get("/posts", apiController.postsGet);

// get single post
router.get("/posts/:id", apiController.singlePostGet);

// handle create post
router.post("/posts/create-posts", apiController.postCreatePost);

// handle create comment
router.post("/posts/:id/create-comment", apiController.commentCreatePost);

// handle post update
router.post("/posts/:id/update", apiController.postUpdatePost);

// handle post delete
router.post("posts/:id/delete", apiController.postDeletePost);

module.exports = router;
