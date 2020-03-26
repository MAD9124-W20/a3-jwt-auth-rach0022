//routes/courses.js
const router = require('express').Router();
const debug = require('debug')('a3:CourseRouter')
const validateCourseId = require('../middleware/validateCourseId.js');
const Course = require('../models/Course.js');
const sanitizeBody = require('../middleware/sanitizeBody.js');
const isAdmin = require('../middleware/isAdmin.js');

router.use('/:id', validateCourseId);

router.get('/', async (req,res) =>{
    //because find is asynchronous we must await the result
    //and make the whole function async
    const data = await Course.find().populate('students');
    res.status(200).send({data}); //send status code 200 for ok
});

router.post('/', sanitizeBody, isAdmin, async (req, res) =>{
    let newCourse = new Course(req.sanitizedBody);
    debug(req.sanitizedBody);
    await newCourse.save();

    res.status(201).send({data: newCourse}); //status code 201 to say created
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.courseId).populate('students');
    res.status(200).send({data: course});
});

router.patch('/:id', sanitizeBody, isAdmin, async (req, res) =>{
    const course = await Course.findByIdAndUpdate(
        req.courseId,
        req.sanitizedBody,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false //taken from mongo docs
            
            // and from https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate 
        },
        (err, data) =>{
            debug(err, data);
            res.status(200).send({data}) //send the status code of 200 to say ok
        }
    ).populate('students')
});

router.put('/:id', sanitizeBody, isAdmin, async (req, res) =>{
    const course = await Course.findByIdAndUpdate(
        req.courseId,
        req.sanitizedBody,
        {
            new: true,
            runValidators: true,
            overwrite: true,
            useFindAndModify: false
        },
        (err, data) =>{
            debug(err, data);
            res.status(200).send({data}) //send the status code of 200 to say ok
        }
    ).populate('students')
});

router.delete('/:id', isAdmin, async (req, res) =>{
    const course = await Course.findByIdAndRemove(req.courseId);
    debug(course);
    res.status(202).send({data: course}); //status code 202 for accepted
});

module.exports = router; 