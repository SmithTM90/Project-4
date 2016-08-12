var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// JSON web token dependencies, including a secret key to sign the token
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;
var app = express();

// Mongoose models and connection
var mongoose = require('mongoose');
var User = require('./models/usersModel');  
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mydbname');

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

app.use('/api/users', expressJWT({secret: secret}).unless({path: ['/api/users'], method: 'post'}), require('./controllers/users'));

// this middleware will check if expressJWT did not authorize the user, and return a message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ message: 'You need an authorization token to view this information.' });
  }
});

// POST /api/auth - if authenticated, return a signed JWT
app.post('/api/auth', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    // return 401 if error or no user
    if (err || !user) return res.status(401).send({ message: 'User not found' });

    // attempt to authenticate a user
    user.authenticated(req.body.password, function(err, result) {
      // return 401 if invalid password or error
      if (err || !result) return res.status(401).send({ message: 'User not authenticated' });

      // sign the JWT with the user payload and secret, then return
      var token = jwt.sign(user.toJSON(), secret);

      return res.send({ user: user, token: token });
    });
  });
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, function() {
  console.log('app listening on port:', PORT);
});