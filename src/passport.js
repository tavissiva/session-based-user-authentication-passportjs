const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./mongoose');
const bcrypt = require('bcrypt');
const UserModel = connection.models.User;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
}

const loginCallback = (username, password, done) =>{
    UserModel.findOne({username: username})
    .then(async(user)=>{
        if(!user){
            done(null, false, {message: 'Username does not exists!'});
        }
        const isValid = await bcrypt.compare(password, user.password);
        if(isValid){
            done(null, user);
        }else{
            done(null, false, {message: 'Incorrect Password!'});
        }
    })
    .catch((err) => done(err));
};


const loginStrategy = new LocalStrategy(customFields, loginCallback);

passport.use('login', loginStrategy);

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async(userId, done)=>{
    UserModel.findById(userId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

module.exports = passport;