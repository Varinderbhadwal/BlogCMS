import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/blogs', { title, content }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog post created successfully');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Post</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            <button type="submit">Create</button>
        </form>
    );
};

export default CreatePost;
