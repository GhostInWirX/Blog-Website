const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { isAdmin } = require('../middleware/auth');

// View all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('username email isAdmin createdAt');
    res.render('admin/users', { users });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching users');
    res.redirect('/');
  }
});

// View all posts
router.get('/posts', isAdmin, async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'username');
    res.render('admin/posts', { posts });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching posts');
    res.redirect('/');
  }
});

// Delete any post
router.delete('/posts/:id', isAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting post');
    res.redirect('/admin/posts');
  }
});

module.exports = router;