//middleware/validateCourseId.js

const Course = require('../models/Course.js'); //get a reference to the course model
const debug = require('debug')('a3:validateCourseId');

const validateCourseId = (req, res, next) => {
    const courseId = req.params.id;
    // debug(courseId);
    const match = Course.findById(courseId, (err, data) =>{
        if(err){
            // debug(err);
            sendResourceNotFound(req, res);
        } else {
            // debug(data); //change to req.validatedId = data._id?
            req.courseId = courseId;
            next();
        }
    })
}

function sendResourceNotFound(req, res){
    res.status(404).send({
        errors: [
            {
                status: 'Not Found',
                code: '404',
                title: 'Resource does not exist',
                description: `We could not find a course with the  id: ${req.params.id}`
            }
        ]
    })
};

module.exports = validateCourseId;