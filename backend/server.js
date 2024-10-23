const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// App setup
const app = express();
app.use(bodyParser.json());
app.use(cors());


// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogCMS', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profileImage: String, // Store the profile image path
});

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    image: String, // Store the blog image path
});

const User = mongoose.model('User', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to prevent overwriting
    },
});
const upload = multer({ storage });

// Register
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, 'secret');
    res.json({ token, username: user.username });
});

// Get Profile
app.get('/profile', async (req, res) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.userId);
        res.json({ username: user.username, email: user.email, profileImage: user.profileImage });
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Update Profile Picture
app.post('/update-profile', upload.single('profileImage'), async (req, res) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.userId);

        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`; // Save the image path in the user profile
        }
        await user.save();
        res.json({ message: 'Profile updated successfully', profileImage: user.profileImage });
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Create Blog
app.post('/create-blog', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.userId); // Get the logged-in user's info

        const blog = new Blog({
            title,
            content,
            author: user.username, // Automatically set the author's name as the logged-in user's username
            image: req.file ? `/uploads/${req.file.filename}` : '', // Save image path if provided
        });
        await blog.save();
        res.json({ message: 'Blog post created' });
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


// Get All Blogs
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
