// Don't forget to use NPM to install Express and Mongoose.
'use strict';

const debug = require('debug')('a3');
const sanitizeMongo = require('express-mongo-sanitize');
require('./startup/database.js')(); //IIFE use of the require statement
const authorization = require('./middleware/auth.js');
const express = require('express');
const app = express();


//we will throw the authorization middleware onto all student and course routes
//so we can make sure they are logged in and then we can add the speefic checks for 
//if they are an admin onto the specific POST PUT PATCH AND DELETE Methods
app.use(express.json()); //allow the app to use json() parser for the requests
app.use(sanitizeMongo()); //catchall to just sanitize all data for mongo use
app.use('/api/courses', authorization, require('./routes/courses.js'));
app.use('/api/students', authorization, require('./routes/students.js')); //turn on when made
app.use('/auth', require('./routes/auth.js')); //use the auth route to create and cerify users

const port = process.env.PORT || 3030;
app.listen(port, () => debug(`Server listening on port: ${port}`));