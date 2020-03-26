const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {type: String, required: true, maxlength: 64},
    ipAddress: {type: String, required: true, maxlength: 64},
    ipAddress: {type: Boolean, required: true},
    createdAt: {type: Date, required: true}
});

module.exports = mongoose.model('Authentication_Attempts', schema);
