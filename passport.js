const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const models = require('./models.js');
const passportJWT = require('passport-jwt');

const users = models.user;
const JWTStrategy = passportJWT.Strategy;//jwt strategy assign to a variable
const ExtractJWT = passportJWT.ExtractJwt; // extract method from header assign to a variable


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, (usernamePass, passwordPass, callback) => {
    console.log(username + '  ' + password);
    users.findOne({ username: usernamePass, password: passwordPass }, (error, user) => {
      if (error) {
        console.log(error);
        return callback(error);
      }
  
      if (!user) {
        console.log('incorrect username');
        return callback(null, false, {message: 'Incorrect username or password.'});
      }
  
      console.log('finished');
      return callback(null, user);
    });
  }));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //method from extractjwt
    secretOrKey: 'your_jwt_secret',
  }, (jwtPayload, callback) => {
    return users.findById(jwtPayload._id)//find out same token id
      .then((user) => {
        return callback(null, user); 
      })
      .catch((error) => {
        return callback(error)
      });
  }));