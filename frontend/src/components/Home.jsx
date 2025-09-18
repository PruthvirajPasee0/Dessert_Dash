import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          setUser(JSON.parse(loggedInUser));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="home-container">
      <h1>Welcome to Dessert Dash, {user.name}!</h1>
      <p>You are logged in as: {user.email}</p>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
    </div>
  );
};

export default Home;