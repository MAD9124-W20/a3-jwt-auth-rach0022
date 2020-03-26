//middleware used to check if the user is an admin
//it will be run after the user is authorized so we
//can access the values in req.user
let User = require('../models/User.js');

module.exports = async (req, res, next) =>{
    let user = await User.findById(req.user._id);

    if(user.isAdmin){
        next();
    }else {
        //if the user is not an admin, then send back a 403 forbidden code
        //in an error object
        console.log(req.user);
        res.status(403).send({
            errors: [
                {
                    status: 'Forbidden',
                    code: '403',
                    title: 'Unauthorized Access of Data',
                    description: 'User does not have access rights to this content'
                }
            ]
        })
    }
}