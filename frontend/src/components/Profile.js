import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Check if token is present
            if (!token) {
                setError('You are not logged in.');
                setLoading(false);
                return;
            }
        
            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('User Data:', response.data); // Log user data
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching profile data:', err.response || err.message); // Log the error
                setError(err.response?.data?.message || 'Error fetching profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.picture && <img src={user.picture} alt="Profile" style={{ width: '100px', height: '100px' }} />}
            </div>
            <div>
                <h2>Options</h2>
                <button onClick={() => window.location.href = '/settings'}>Edit Profile</button>
            </div>
        </div>
    );
};

export default Profile;
