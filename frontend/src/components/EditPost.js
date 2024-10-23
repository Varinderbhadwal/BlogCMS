import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
    const { postId } = useParams();
    const [blog, setBlog] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchBlog = async () => {
            const response = await axios.get(`http://localhost:5000/api/blogs/${postId}`);
            setBlog(response.data);
        };
        fetchBlog();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/blogs/${postId}`, blog, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog post updated successfully');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Post</h2>
            <input type="text" placeholder="Title" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} required />
            <textarea placeholder="Content" value={blog.content} onChange={(e) => setBlog({ ...blog, content: e.target.value })} required></textarea>
            <button type="submit">Update</button>
        </form>
    );
};

export default EditPost;
