import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await axios.get('http://localhost:5000/api/blogs');
            setBlogs(response.data);
        };
        fetchBlogs();
    }, []);

    return (
        <div>
            <h2>Blog Posts</h2>
            {blogs.map(blog => (
                <div key={blog._id}>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>
                    <p>By: {blog.author.username}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
