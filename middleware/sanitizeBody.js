const debug = require('debug')('a3:sanitize');
const xss = require('xss'); //may have to use let if const dosent work

const stripTags = payload => {
    let attributes = {...payload}; //we copy the payload so as to not mutate it
    for(let key in payload){
        if(attributes[key] instanceof Array){ //to check if the element is an array
            attributes[key] = attributes[key].map(element =>{
                //either check if its a string or recursively pass it again to strip tags to go down another level
                // let cleanedElement = typeof element === 'string' ? sanitize(element) : stripTags(element);
                // return cleanedElement;
                return typeof element === "string" ? sanitize(element) : stripTags(element)

            })
        } else if(attributes[key] instanceof Object){ //if its an object send it down another level recursively
            attributes[key] = stripTags(attributes[key]);
        } else { //if the is just a string datatype the normal sanitize
            attributes[key] = sanitize(attributes[key]);
        }
    };
    return attributes;
}

const sanitize = sourceString => {
    return xss(sourceString, {
        whitelist: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    });
}

module.exports = (req,res,next) => {
    //logic to sanitize the data goes here
    const{id,_id, ...attributes} = req.body; //strip out the id portion of the request
    const sanitizedBody = stripTags(attributes);

    req.sanitizedBody = sanitizedBody; //set the new sanitized body without mutating the original data
    debug(req.body);
    next(); //call the next function in the request loop
}