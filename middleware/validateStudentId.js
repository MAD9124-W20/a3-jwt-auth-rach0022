//middleware/validateStudentId.js

const Student = require('../models/Student.js');
const debug = require('debug')('a3:validateStudentId');

const validateStudentId = (req, res, next) =>{
    const studentId = req.params.id;
    const match = Student.findById(studentId, (err, data)=>{
        if(err){
            sendResourceNotFound(req, res);
        } else {
            req.studentId = studentId;
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
                description: `We could not find a student with the  id: ${req.params.id}`
            }
        ]
    })
};

module.exports = validateStudentId; 