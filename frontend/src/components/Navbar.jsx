import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyUserAccess = () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (!token || !userStr) {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    return;
                }

                const user = JSON.parse(userStr);
                setIsAuthenticated(true);
                setIsAdmin(user && user.role === 'admin');
            } catch (error) {
                console.error('Error verifying user access:', error);
                setIsAuthenticated(false);
                setIsAdmin(false);
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
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                        )}
                        <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;