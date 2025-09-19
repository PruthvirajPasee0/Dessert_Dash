import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    secretKey: ''
  });
  const [showAdminFields, setShowAdminFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Secret key validation for admin registration
    if (showAdminFields && !formData.secretKey) {
      newErrors.secretKey = 'Secret key is required for admin registration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        ...formData,
        isAdmin: showAdminFields
      };

      const response = await authService.register(requestData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (err.response.data.message.includes('email')) {
          setErrors({
            ...errors,
            email: 'This email is already registered'
          });
        } else if (err.response.data.message.includes('secret key')) {
          setErrors({
            ...errors,
            secretKey: 'Invalid secret key'
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-background">
      <div className="register-container">
        <div className="dessert-icon dessert-icon-1"></div>
        <div className="dessert-icon dessert-icon-2"></div>
        <div className="welcome-image" title="Welcome to Dessert Dash"></div>
        <h2>Join Our Sweet Community</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={showAdminFields}
              onChange={(e) => {
                setShowAdminFields(e.target.checked);
                if (!e.target.checked) {
                  setFormData(prev => ({
                    ...prev,
                    isAdmin: false,
                    secretKey: ''
                  }));
                }
              }}
            />
            Register as Admin
          </label>
        </div>

        {showAdminFields && (
          <div className="form-group">
            <label htmlFor="secretKey">Admin Secret Key</label>
            <input
              type="password"
              id="secretKey"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              className={errors.secretKey ? 'input-error' : ''}
              required
            />
            {errors.secretKey && <div className="field-error">{errors.secretKey}</div>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            required
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            required
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
            required
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      </div>
    </div>
  );
};

export default Register;