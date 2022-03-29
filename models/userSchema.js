const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    followers: [],
    followings: [],
},
    { timestamp: true }
)

exports.User = mongoose.model('User', userSchema)
