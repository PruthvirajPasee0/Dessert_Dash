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
        // Format example: 12 Jan 2021 (matches reference design)
        return date
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            .replace(/,/g, '');
    };

    const firstName = (profile?.name || '').split(' ')[0] || 'there';

    return (
        <div className="profile-page">
            <div className="profile-card redesigned">
                {/* Header: Avatar, Name/Email, and Upload CTA */}
                <div className="profile-header-row">
                    <div className="avatar">
                        {profile.imageUrl ? (
                            <img
                                src={`https://dessert-dash-backend.onrender.com${profile.imageUrl}`}
                                alt={`${profile.name}'s profile`}
                                onError={(e) => {
                                    e.target.src = '/placeholder-profile.png';
                                    e.target.onerror = null;
                                }}
                            />
                        ) : (
                            <img src="/placeholder-profile.png" alt="Profile placeholder" />
                        )}
                    </div>
                    <div className="identity">
                        <h2 className="profile-name">{profile.name}</h2>
                        <div className="profile-email">{profile.email}</div>
                    </div>
                    <div className="header-action">
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
                            className={`upload-cta ${uploading ? 'uploading' : ''}`}
                            role="button"
                            aria-live="polite"
                        >
                            <svg
                                className="btn-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                aria-hidden="true"
                            >
                                <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{uploading ? 'Uploading...' : 'Upload New Picture'}</span>
                        </label>
                        {uploadError && <p className="upload-error">{uploadError}</p>}
                    </div>
                </div>

                {/* Details section */}
                <div className="profile-details-card">
                    <div className="detail-row">
                        <span className="detail-label">Full Name</span>
                        <span className="detail-value">{profile.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{profile.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Member Since</span>
                        <span className="detail-value">{formatDate(profile.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Account Type</span>
                        <span className="detail-value capitalize">{profile.role}</span>
                    </div>
                </div>

                {/* Footnote */}
                <p className="profile-footnote">
                    Every sweet has a story—thanks for making ours sweeter, {firstName}.
                </p>
            </div>
        </div>
    );
};

export default Profile;