import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Sweets from './Sweets';
import './Home.css';

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
      <div className="hero-section">
        <div className="hero-content">
          <h1>Handmade joys, one sweet at a time</h1>
          <p>Warm, small-batch sweets crafted daily. Browse our artisan selection and find your new favorite.</p>
          <button className="shop-now-btn" onClick={() => document.querySelector('.sweets-container').scrollIntoView({ behavior: 'smooth' })}>Shop Now</button>
        </div>
        <div className="hero-image">
          <img src="/hero_image.jpg" alt="Delicious desserts" />
        </div>
      </div>
      <Sweets />
    </div>
  );
};

export default Home;