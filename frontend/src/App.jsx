import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import './components/Auth.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import AdminDashboard from './components/AdminDashboard'
import './components/AdminDashboard.css'
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext'

const ProtectedAdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  let isAdmin = false;

  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      isAdmin = user.role === 'admin';
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  )
}

export default App
