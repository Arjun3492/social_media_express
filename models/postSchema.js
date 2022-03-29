const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    comment: { type: String, required: true },
    commentedBy: { type: String, required: true },
}, { timestamp: true });

const postSchema = new Schema({
    ownerId: { type: String, required: true },
    desc: { type: String, required: true },
    title: { type: String, required: true },
    comments: [commentSchema],
    likes: [],

},
    { timestamp: true }
)

exports.Post = mongoose.model('Post', postSchema)
