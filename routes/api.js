const express = require("express");
const apiController = require("../controllers/apiController");

const router = express.Router();

router.post("/sign-in", apiController.signUpPost);

// get posts
router.get("/posts", apiController.postsGet);

// handle create post
router.post("/posts/create-posts", apiController.postCreatePost);

// handle create comment
router.post("/posts/:id/create-comment", apiController.commentCreatePost);

module.exports = router;
