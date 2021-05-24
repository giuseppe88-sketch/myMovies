const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const passportJWT = require('passport-jwt');
const models = require('./models.js');

const users = models.user;
const JWTStrategy = passportJWT.Strategy;//jwt strategy assign to a variable
const ExtractJWT = passportJWT.ExtractJwt; // extract method from header assign to a variable



passport.use(
    new LocalStrategy(
      {
    usernameField: 'username',
    passwordField: 'password',
  }, 
  (username, password, callback) => {
   console.log(username + '  ' + password);
    users.findOne(
      { username: username} /*, password: password }*/, 
      (error, user) => {
      if (error) {
        console.error(error);
        return callback(error);
      }
      if (!user) {
        console.log('incorrect username');
        return callback(null, false, {message: 'Incorrect username or password.'});
      }
      if (!user.validatePassword(password)) {
        console.log('incorrect password');
        return callback(null, false, {message: 'Incorrect password.'});
      }
      console.log('finished');
      return callback(null, user);
     },
     );
    },
  ),
);
      passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  }, (jwtPayload, callback) => {
    return users.findById(jwtPayload._id)
      .then((user) => {
        return callback(null, user);
      })
      .catch((error) => {
        return callback(error)
      });
  }));