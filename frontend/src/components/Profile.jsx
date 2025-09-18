import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile');
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!profile) {
        return <div className="loading">Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-card">
                <div className="profile-field">
                    <label>Full Name</label>
                    <p>{profile.name}</p>
                </div>
                <div className="profile-field">
                    <label>Email</label>
                    <p>{profile.email}</p>
                </div>
                <div className="profile-field">
                    <label>Member Since</label>
                    <p>{formatDate(profile.createdAt)}</p>
                </div>
                <div className="profile-field">
                    <label>Account Type</label>
                    <p className="capitalize">{profile.role}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;