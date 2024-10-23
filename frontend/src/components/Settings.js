import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [user, setUser] = useState({ username: '', email: '' });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/auth/profile', user, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('Profile updated successfully');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Settings</h2>
            <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
            />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default Settings;
