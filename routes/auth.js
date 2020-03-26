//first require all the modules necessary
const router = require('express').Router();
const User = require('../models/User.js');
const sanitizeBody = require('../middleware/sanitizeBody');
const authorize = require('../middleware/auth.js');
const authentication_attempts = require('../models/Authentication_Attempts.js');

//create the post method that will take in the user email, password etc
//from the request body and will verify if the email is unique then create the user/
//add them to the database
router.post('/users', sanitizeBody, async(req, res) =>{
    try{
        let newUser = new User(req.sanitizedBody);
        const itExists = !!(await User.countDocuments({email: newUser.email}));

        if(itExists){
            //return an error array saying the email is already in use
            return res.status(400).send({
                errors:[
                    {
                        status: 'Bad Request',
                        code: '400',
                        title: 'Validation Error',
                        detail: `${newUser.email} is already in user`,
                        source: {pointer: 'data/attributes/email'}
                    }
                ]
            })
        }

        await newUser.save(); //save the user to the database if the above succeeds
        res.status(201).send({data: newUser});
    } catch(err){

        //if we catch an error say theere was a problem saving the new user
        res.status(500).send({
            errors:[
                {
                    status: 'Internal Server Error',
                    code: '500',
                    title: 'Problem Saving Document to Database'
                }
            ]
        })
    }
});

//now get the email and password from the user to "log" them in
//and send back the Bearer authorization token if it succeeds
//that will be used to verify the user on all subsequent routes in the student
//and course routes, also sanitize the body of any malicious data
router.post('/tokens', sanitizeBody, async (req, res) => {
    //use object destructing to get the email and password from sanitized request body
    const {email, password} = req.sanitizedBody;

    //use the function we added to the user model to authenticate them
    const user = await User.authenticate(email, password);

    if(!user){
        logAuthorizationAttempt(req, false);
        return res.status(401).send({
            errors: [
                {
                    status: 'Unauthorized',
                    code: '401',
                    title: 'Incorrect Username or Password'
                }
            ]
        })
    }

    //if the user validates properly send back the Bearer token with the generate auth token function
    //we added onto the user model
    logAuthorizationAttempt(req, true);
    res.status(201).send({data: {token: user.generateAuthToken()}})
});

//get the jwt from the request header
//validate the jwt from the middleware
//load the user document form the datavase using the _id from the JWT
//and redact the sensitive data like the password and send it back to the client
router.get('/users/me', authorize, async (req, res) =>{
    let user = await User.findById(req.user._id);
    res.status(200).send({data: user});
})

//because we will log the authentication attempt only after attempt was made
//we will only use the sanitized body from the request to avoid any malicious attempts
const logAuthorizationAttempt = function(req, didSucceed){
    //first get the authentication attempt info from the sanitized body
    const {email} = req.sanitizedBody;
    console.log(email, req); //log the request to see how to get the rest of the info
} 

module.exports = router;