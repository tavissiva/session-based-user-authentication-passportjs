const passport = require('./passport');

const isAuth = (req, res, next)=>{
    if(!req.isAuthenticated()){
        res.redirect('/users/login')
    }
    next();
}

module.exports = {
    isAuth
}