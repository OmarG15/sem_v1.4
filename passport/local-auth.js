const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});


//cuando el usuario se logue utiliza este modulo
passport.use('local-signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true
    //el modulo recibe los datos y crea un nuevo usuario
}, async (req, email, password, done) => {
    const user = await User.findOne({'email': email})
    console.log(user);

    if(user){
      return done(null, false, req.flash('Mensaje de Registro', 'El Email ya a sido registrado.'));
    } else {
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      await newUser.save();
      done(null, newUser);
    }
  }));