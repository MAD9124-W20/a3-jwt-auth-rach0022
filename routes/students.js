//routes/students.js
const router = require('express').Router();
const debug = require('debug')('a3:StudentRouter');
const validateStudentId = require('../middleware/validateStudentId.js');
const Student = require('../models/Student.js');
const sanitizeBody = require('../middleware/sanitizeBody.js');

router.use('/:id', validateStudentId);

router.get('/', async (req, res) =>{
    const data = await Student.find();
    res.status(200).send({data});
});

router.post('/', sanitizeBody, async (req, res) =>{
    let newStudent = new Student(req.sanitizedBody);
    debug(req.sanitizedBody);
    await newStudent.save();

    res.status(201).send({data: newStudent});
});

router.get('/:id', async (req, res) =>{
    const student = await Student.findById(req.studentId);
    res.status(200).send({data: student});
});

router.patch('/:id', sanitizeBody, async (req, res) =>{
    const student = await Student.findByIdAndUpdate(
        req.studentId,
        req.sanitizedBody,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        },
        (err, data) =>{
            debug(err, data);
            res.status(200).send({data})
        }
    )
});
router.put('/:id', sanitizeBody, async (req, res) =>{
    const student = await Student.findByIdAndUpdate(
        req.studentId,
        req.sanitizedBody,
        {
            new: true,
            runValidators: true,
            overwrite: true,
            useFindAndModify: false
        },
        (err, data) =>{
            debug(err, data);
            res.status(200).send({data})
        }
    )
});
router.delete('/:id', sanitizeBody, async (req, res) =>{
    const student = await Student.findByIdAndRemove(req.studentId);
    debug(student);
    res.status(200).send({data: student})
});

module.exports = router; 