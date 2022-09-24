const express = require("express");
const apiController = require("../controllers/apiController");

const router = express.Router();

router.post("/sign-in", apiController.signUpPost);
