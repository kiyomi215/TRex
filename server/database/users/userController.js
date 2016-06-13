var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

//Promisify a few mongoose methods with the 'q' promise library -KN
var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    findUser({username: username})
      .then(function (user) {
        if(!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function (foundUser) {
              if(foundUser){
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                return next(new Error('no user'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    //check to see if user already exists
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exists!'));
        } else {
          //make a new user if it doesn't already exist
          return createUser({
            username: username,
            password: password
          });
        }
      })
      .then(function (user) {
        //create token to send by for authentication
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header if there is one
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      // then decode the token, which we end up being the user object
      var user = jwt.decode(token, 'secret');
      // check to see if that user exists in the database
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  },

  fetchAll: function(callback) {
    User.find(function(err,users) {
      if(err) {
        console.error(err);
      } else {
        callback(users);
      }
    });
  },
  
  getUserStats: function(username, callback) {	
  	User.findOne({username: username}).exec(function(err, foundUser) {
  		if (foundUser) {
        console.log('found the user');
  			callback(foundUser);
  		} else {
        console.log('did not find the user');
  			var user = {username: username, wins: 0, losses: 0};
        User.create(user);
        callback(user);
  		}
  	});
  },
  
  updateUserStats: function(username, didUserWin, callback) {
    if (didUserWin) {
      User.update({username: username}, {$inc: {wins: 1}}, function (err, data) {
        if (err) {
          console.log('Error ', err);
        } else {
          console.log('The response was ', data);
        }
      });
    } else {
      User.update({username: username}, {$inc: {losses: 1}}, function (err, data) {
        if (err) {
          console.log('Error ', err);
        } else {
          console.log('The response was ', data);
        }
      });
    }
  }
};