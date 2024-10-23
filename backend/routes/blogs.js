const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');

const router = express.Router();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token.split(' ')[1], 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Create Blog Post
router.post('/', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content, author: req.user.id });
    await newBlog.save();
    res.status(201).send('Blog post created');
});

// Get All Blog Posts
router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username email');
    res.json(blogs);
});

// Edit Blog Post
router.put('/:id', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user.id) {
        return res.status(403).send('Unauthorized');
    }
    blog.title = title;
    blog.content = content;
    await blog.save();
    res.send('Blog post updated');
});

// Delete Blog Post
router.delete('/:id', authenticateJWT, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user.id) {
        return res.status(403).send('Unauthorized');
    }
    await blog.remove();
    res.send('Blog post deleted');
});

module.exports = router;
