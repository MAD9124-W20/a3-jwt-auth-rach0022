const bcrypt = require('bcrypt');
const saltRounds = 14;
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const JWTPrivateKey = "superSecureSecretToChangeLater";

const schema = new mongoose.Schema({
    firstName: {type: String, trim: true, maxlength: 64, required: true},
    lastName: {type: String, trim: true, maxlength: 64, required: true},
    email: {type: String, trim: true, maxlength: 512, required: true, unique: true},
    password: {type: String, trim: true, maxlength: 70, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
});

//create a method on the student to generate the Authorization Token
//uisng the JWT sign function
schema.methods.generateAuthToken = function(){
    return JWT.sign({_id: this.id}, JWTPrivateKey); //change this later to not using a variable
};

//create a static method on the user to authenticate them so we dont have to put the code everytime
//on each rotuer module
schema.statics.authenticate = async function(email, password) {
    const user = await this.findOne({email}); //using the json shorthand of email:email
    const hashedPassword = user ? user.password : `2b${saltRounds}$invalidusernamame1246a667aaa4sdgfa54aa456674887sfdg453873894`;
    const passwordDidMatch = await bcrypt.compare(password, hashedPassword); //now use the bcrypt function to compare the password with the hashed password

    return passwordDidMatch ? user : null //now return the user or null if it did not match
};

//everytime the password is compared or a new one is saved we dont want to lose the password
//hashed value so we will save a new hash of the password? Robert help i forgot why we did this
schema.pre('save', async function(next) {
    if (!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

//everytime we return the user data we dont want to return the password
//or other data so we stript it off after we convert the user to JSON (like mongoose normaly does)
//and then return that data to wherever needed
schema.methods.toJSON = function(){
    const user = this.toObject();

    delete user.password;
    delete user.__v;
    delete user._id;
    return user;
};

module.exports = mongoose.model('User', schema);