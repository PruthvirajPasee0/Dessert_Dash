import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setUploadError('Image size must be less than 5MB');
            return;
        }

        setUploadError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await userService.updateProfilePicture(formData);
            setProfile(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
        } catch (err) {
            console.error('Error uploading image:', err);
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

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
                <div className="profile-image-section">
                    <div className="profile-image">
                        {profile.imageUrl ? (
                            <img
                                src={`http://localhost:8000${profile.imageUrl}`}
                                alt={profile.name}
                                onError={(e) => {
                                    e.target.src = '/placeholder-profile.png';
                                    e.target.onerror = null;
                                }}
                            />
                        ) : (
                            <img src="/placeholder-profile.png" alt="haha"/>
                        )}
                    </div>
                    <div className="profile-image-upload">
                        <input
                            type="file"
                            id="profile-image-input"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="profile-image-input"
                            className={`upload-button ${uploading ? 'uploading' : ''}`}
                        >
                            {uploading ? 'Uploading...' : 'Upload New Picture'}
                        </label>
                        {uploadError && (
                            <p className="upload-error">{uploadError}</p>
                        )}
                    </div>
                </div>
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