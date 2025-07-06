const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
app.use(methodOverride('_method'));
// Database connection
mongoose.connect('mongodb://localhost:27017/blog-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));


app.use(passport.initialize());
app.use(passport.session())



// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Passport config
require('./config/passport.js')(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Import routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');


app.use('/admin', adminRoutes);

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));