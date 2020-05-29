var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    passport = require('passport')

var User = require('../models/users');

router.get('/', function(req, res){
	res.render('users/landing')
});

router.get('/about', function(req, res){
	res.render('users/about')
});

router.get('/register', function(req, res){
   res.render('users/register');
});

router.post('/register', function(req, res){
   var fname = req.body.fname;
   var lname = req.body.lname;
   var username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;

   var newUser = {fname: fname, lname: lname, username: username};
   
   if(password != password2){
      req.flash('error', 'Password is not match');
      return res.redirect('/register');
   }
   
   User.register(newUser, password, function(err, newUser){
      if(err){
         console.log(err)
         req.flash('error', err.message)
         return res.redirect('/register')
      }
      else {
         passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to GO Hotel ' + newUser.username);
            res.redirect('/hotels');
         });
      }
   });
});

router.get('/login', function(req, res){
   res.render('users/login');
});

router.post('/login', passport.authenticate('local',
   {
      successRedirect: '/hotels',
      failureRedirect: '/login'
   }), function(req, res){    
});

router.get('/logout', function(req, res){
   req.logout();
   req.flash('success', 'Successfully logged out');
   res.redirect('/hotels');
});

module.exports = router;