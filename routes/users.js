const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Register routes
router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', userController.register);

// Login routes
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', userController.login);

// Logout route
router.get('/logout', userController.logout);

module.exports = router;

