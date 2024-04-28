var express = require('express');
var router = express.Router();
const passport = require('../src/passport');
const connection = require('../src/mongoose');
const UserModel = connection.models.User;
const bcrypt = require('bcrypt');
const { isAuth } = require('../src/utility');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', (req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

router.get('/login', (req, res)=>{
  res.render('login');
})

router.post('/login', 
  passport.authenticate('login', {
    failureRedirect: '/users/login-failure',
    failureMessage: true,
    successRedirect: '/users/login-success'
  })
);

router.get('/login-failure', (req, res)=>{
  let errorMessage = req.session?.messages || [];
  console.log('errorMessage :  ', errorMessage.slice(-1));
  res.render('login', { message: errorMessage.slice(-1) });
});

router.get('/login-success', (req, res)=>{
  res.redirect('/');
});

router.get('/register', (req, res)=>{
  res.render('register');
})

router.post('/register', async(req, res, next)=>{
  //TODO: Validation of inputs fields
  try{
    let user = await UserModel.findOne({username: req.body.username});
    if(!user){
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new UserModel({
        username: req.body.username,
        password: hashedPassword
      });
      user = await newUser.save();
      req.login(user, (err)=>{
        if (err) { return next(err); }
        return res.redirect('/');
      })
    }else{
      res.render('register', { message: 'Username is already exists!'})
    }
  }
  catch(err){
    throw err;
  }
});

router.get('/register-failure', (req, res)=>{
  let errorMessage = req.session?.message || '';
  res.render('register', { message: errorMessage });
});

router.get('/register-success', (req, res)=>{
  res.redirect('/');
});

module.exports = router;
