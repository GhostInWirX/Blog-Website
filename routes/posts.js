const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all posts
router.get('/', postController.getAllPosts);

// Create new post
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('posts/new');
});


router.post('/', ensureAuthenticated, postController.createPost);

// Get single post
router.get('/:id', postController.getPost);

// Edit post
router.get('/:id/edit', ensureAuthenticated, postController.editPost);

router.put('/:id', ensureAuthenticated, postController.updatePost);

// Delete post
router.delete('/:id', ensureAuthenticated, postController.deletePost);

module.exports = router;