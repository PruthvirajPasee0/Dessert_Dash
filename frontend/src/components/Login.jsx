import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
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

      const response = await authService.login(requestData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setServerError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setErrors({
          ...errors,
          password: 'Invalid email or password'
        });
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('secret key')) {
        setErrors({
          ...errors,
          secretKey: 'Invalid secret key'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
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
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;