const JWT = require('jsonwebtoken');
const JWTPrivateKey = "superSecureSecretToChangeLater";

const parseToken = function(headerValue){
    if(headerValue){
        const [type, token] = headerValue.split(' '); //get the type of hopefully Bearer
        if(type === 'Bearer' && typeof token != undefined){
            return token;
        } else {
            return undefined
        }
    }
}

//now that we have the middle ware to authorize
//we can use this in all the routes needed for all student and course routes
module.exports  = (req, res, next) =>{
    //get the JWT from the request header
    const token = parseToken(req.header('Authorization'));
    
    //if we dont have a token send an error
    if(!token){
        return res.status(401).send({
            //we will stop the request by sending an error
            errors: [
                {
                    status: 'Unauthorized',
                    code: '401',
                    title: "Authentication Failed",
                    description: "Missing Bearer Token"
                }
            ]
        })
    }

    //now we try and validate the jwt
    try{
        const payload = JWT.verify(token, JWTPrivateKey);
        req.user = payload;
        console.log(payload);
        next();
    } catch (err) {
        //if the JWT does not validate properly
        res.status(400).send({
            errors: [
                {
                    status: 'Bad Request',
                    code: '400',
                    title: 'Validation Error',
                    description: 'Invalid Bearer Token'
                }
            ]
        })
    }
}