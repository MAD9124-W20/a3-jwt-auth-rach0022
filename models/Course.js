const mongoose = require('mongoose');
const Student = require('./Student.js');

const schema = new mongoose.Schema({
    code: {type: String, required: true},
    title: {type: String, required: true},
    description: String,
    url: String,
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
});

module.exports = mongoose.model('Course', schema);
