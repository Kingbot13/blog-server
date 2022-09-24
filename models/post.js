const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId},
    title: String,
    date: Date,
    content: String,
    comments: Array,
    isPublished: Boolean
});

PostSchema.virtual('url').get(function() {
    return `/posts/${this._id}`
});

module.exports = mongoose.model("Post", PostSchema);