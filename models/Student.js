const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    nickName: String,
    email: {type: String, required: true}
});

module.exports = mongoose.model('Student', schema);
