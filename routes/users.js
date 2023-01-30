var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  //get all records 
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({users: users});
    }, (err) => next(err))
    .catch((err) => next(err));
});
//register new user,
router.post('/signup', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Username Already in Use!"});
      // res.statusCode = 500;
      // res.setHeader('Content-Type', 'application/json');
      // res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user)  => {
        if (err) {
          return res.status(401).json({ message: "User Registration Failed!"});
          // res.statusCode = 500;
          // res.setHeader('Content-Type', 'application/json');
          // res.json({err: err});
          // return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
    return next(err);

    if (!user) {
     return res.status(500).json({message: "Invalid username or password"});
     // res.setHeader('Content-Type', 'application/json');
      //res.json({success: false, status: 'Login Unsuccessful!', err: info});
      //return; //added 24/11/22 
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({message: "Could not log in user!"});
        //res.setHeader('Content-Type', 'application/json');
        //res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'}); 
        //return;  //added 24/11/22         
      }
      else {
      //create jwt web token when user is authenticated
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
      }
    }); 
  }) (req, res, next);
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
}); 

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});


module.exports = router;
  
