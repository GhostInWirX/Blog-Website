const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validators');
const passport = require('passport');

exports.register = async (req, res, next) => {
  try {
    // Validate data
    const { error } = registerValidation.validate(req.body);
    if (error) {
      req.flash('error_msg', error.details[0].message);
      return res.redirect('/users/register');
    }

    // Check if user exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/users/register');
    }

    // Create user
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    req.flash('error_msg', error.details[0].message);
    return res.redirect('/users/login');
  }
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        req.flash('error_msg', 'Error logging out');
        return res.redirect('/posts');
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    });
  };