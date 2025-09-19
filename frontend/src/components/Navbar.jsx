import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyUserAccess = () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (!token || !userStr) {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setUser(null);
                    return;
                }

                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData && userData.role === 'admin');
            } catch (error) {
                console.error('Error verifying user access:', error);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUser(null);
            }
        };

        verifyUserAccess();
        window.addEventListener('storage', verifyUserAccess);
        return () => window.removeEventListener('storage', verifyUserAccess);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link">Dessert Dash</Link>
            </div>
            <div className="navbar-links"> 
                <>
                    <Link to="/sweets" className="nav-link">Sweets</Link>
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                    <Link to="/profile" className="profile-image-container">
                        <img
                            src={`http://localhost:8000${user?.imageUrl}` || '/placeholder-profile.png'}
                            alt="Profile"
                            className="profile-image"
                            onError={(e) => {
                                e.target.src = '/placeholder-profile.png'; 
                                e.target.onerror = null;
                            }}
                        />
                    </Link>
                </>
            </div>
        </nav>
    );
};

export default Navbar;