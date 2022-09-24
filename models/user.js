const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    LastName: String,
    isAdmin: Boolean,
});

module.exports = mongoose.model("User", UserSchema);