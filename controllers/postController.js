const Post = require('../models/Post');
const { postValidation } = require('../validators');

exports.getAllPosts = async (req, res) => {
  try {
    let query = {};
    
    if (req.query.search) {
      const searchTerm = req.query.search;
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }
    
    
    const posts = await Post.find(query).populate('createdBy', 'username').sort({ createdAt: -1 });
    res.render('posts/index', { posts });
  } catch (err) {
    console.error(err);
     res.redirect('/posts');
  }
};

exports.createPost = async (req, res) => {
  try {
    const { error } = postValidation.validate(req.body);
    if (error) {
      req.flash('error_msg', error.details[0].message);
      return res.redirect('/posts/new');
    }

    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      tags,
      createdBy: req.user._id
    });

    await post.save();
    req.flash('success_msg', 'Post created successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.redirect('/posts/new');
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'username');
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }
    res.render('posts/show', { post });
  } catch (err) {
    console.error(err);
    res.redirect('/posts');
  }
};

exports.editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check if user owns the post
    if (!post.createdBy.equals(req.user._id)) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    res.render('posts/edit', { post });
  } catch (err) {
    console.error(err);
    res.redirect('/posts');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { error } = postValidation.validate(req.body);
    if (error) {
      req.flash('error_msg', error.details[0].message);
      return res.redirect(`/posts/${req.params.id}/edit`);
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check if user owns the post
    if (!post.createdBy.equals(req.user._id)) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    post.title = req.body.title;
    post.content = req.body.content;
    post.tags = tags;

    await post.save();
    req.flash('success_msg', 'Post updated successfully');
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/posts/${req.params.id}/edit`);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check if user owns the post
    if (!post.createdBy.equals(req.user._id)) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    await Post.findByIdAndDelete(req.params.id); // Directly delete the post
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting post');
    res.redirect('/posts');
  }
};