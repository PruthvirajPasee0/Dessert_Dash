import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    
    // Get cart data from location state or redirect back to cart
    const cartData = location.state?.cartItems;
    const cartTotal = location.state?.cartTotal;
    
    // Initialize state
    const [paymentMethod, setPaymentMethod] = useState('GPay');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('GPay');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [showQR, setShowQR] = useState(false);
    
    // Redirect if no cart data
    useEffect(() => {
        if (!cartData || !cartTotal) {
            navigate('/cart');
        }
    }, [cartData, cartTotal, navigate]);
    
    if (!cartData || !cartTotal) {
        return null;
    }
    
    // Calculate order details
    const subtotal = cartTotal;
    const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
    const delivery = 3.70;
    const total = parseFloat((subtotal + tax + delivery).toFixed(2));
    
    const handlePaymentMethodChange = (e) => {
        setUpiId(e.target.value);
        // Clear validation errors when changing UPI ID
        setValidationErrors({});
    };
    
    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        setPaymentMethod(method);
        // Clear validation errors when changing payment method
        setValidationErrors({});
    };
    
    const handleShowQR = () => {
        try {
            if (!selectedPaymentMethod) {
                setError('Please select a payment method first');
                return;
            }
            setShowQR(true);
        } catch (err) {
            console.error('Error showing QR code:', err);
            setError('Failed to display QR code. Please try again.');
        }
    };
    
    const validateForm = () => {
        const errors = {};
        
        try {
            if (paymentMethod === 'UPI' || upiId.trim() !== '') {
                // Basic UPI ID validation (username@provider format)
                const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
                if (!upiId.trim() || !upiRegex.test(upiId)) {
                    errors.upiId = 'Please enter a valid UPI ID (e.g., username@upi)';
                }
            }
            
            if (!selectedPaymentMethod) {
                errors.paymentMethod = 'Please select a payment method';
            }
        } catch (err) {
            console.error('Validation error:', err);
            errors.general = 'An error occurred during validation';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handlePayment = async () => {
        try {
            // Validate form before proceeding
            if (!validateForm()) {
                return;
            }
            
            setIsProcessing(true);
            setError('');
            
            // Generate a unique order ID
            const orderId = `ORD-${Date.now().toString().slice(-6)}`;
            
            // Prepare items data for stock verification
            const items = cartData.map(item => ({
                sweetId: item.id,
                quantity: item.quantity,
                price: item.price
            }));
            
            // Verify stock availability first
            const stockCheck = await api.post('/purchases/verify-stock', { items });
            
            if (!stockCheck.data.available) {
                const unavailableItems = stockCheck.data.unavailableItems;
                throw new Error(
                    `Some items are out of stock: ${unavailableItems
                        .map(item => item.name || 'Unknown item')
                        .join(', ')}`
                );
            }
            
            // Prepare complete purchase data
            const purchaseData = {
                orderId,
                items,
                paymentMethod: selectedPaymentMethod || paymentMethod,
                paymentDetails: { 
                    upiId: upiId || `default@${(selectedPaymentMethod || paymentMethod).toLowerCase()}`,
                    timestamp: new Date().toISOString()
                },
                totalAmount: total,
                tax: tax,
                deliveryFee: delivery
            };
            
            // Process the purchase with transaction
            const response = await api.post('/purchases/process', purchaseData);
            
            if (response.data.status === 'success') {
                // Clear the cart after successful purchase
                clearCart();
                
                // Navigate to success page with order details
                navigate('/purchase-success', { 
                    state: { 
                        orderId: response.data.orderId,
                        total: total.toFixed(2)
                    }
                });
            } else {
                throw new Error('Purchase processing failed');
            }
            
        } catch (err) {
            console.error('Payment processing error:', err);
            
            // Handle specific error cases
            const errorData = err.response?.data;
            
            switch(errorData?.error) {
                case 'INSUFFICIENT_STOCK':
                    setError('Some items are no longer available. Please review your cart.');
                    break;
                case 'DUPLICATE_ORDER':
                    setError('This order has already been processed. Please check your purchase history.');
                    break;
                case 'INVALID_DATA':
                    setError('Invalid purchase data. Please check your cart items.');
                    break;
                case 'DATABASE_ERROR':
                    setError('A system error occurred. Please try again later.');
                    break;
                default:
                    setError(errorData?.message || 'Failed to process payment. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleCancel = () => {
        navigate('/cart');
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <p className="order-info">Secure payment for Order #{Math.floor(Math.random() * 10000)}-{Math.floor(Math.random() * 10000)}</p>
            
            <div className="checkout-content">
                <div className="payment-options">
                    <h3>UPI Details</h3>
                    <div className="upi-input">
                        <label htmlFor="upiId">Enter UPI ID</label>
                        <input 
                            type="text" 
                            id="upiId" 
                            placeholder="username@upi" 
                            value={upiId}
                            onChange={handlePaymentMethodChange}
                        />
                        <p className="upi-info">We'll send a collect request to your UPI app for approval.</p>
                    </div>
                    
                    <div className="payment-methods">
                        <div 
                            className={`payment-method ${selectedPaymentMethod === 'GPay' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodSelect('GPay')}
                        >
                            <span className="payment-icon">📱</span>
                            <span>GPay</span>
                        </div>
                        <div 
                            className={`payment-method ${selectedPaymentMethod === 'PhonePe' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodSelect('PhonePe')}
                        >
                            <span className="payment-icon">📲</span>
                            <span>PhonePe</span>
                        </div>
                        <div 
                            className={`payment-method ${selectedPaymentMethod === 'Paytm' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodSelect('Paytm')}
                        >
                            <span className="payment-icon">💳</span>
                            <span>Paytm</span>
                        </div>
                        <div 
                            className={`payment-method ${selectedPaymentMethod === 'BHIM' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodSelect('BHIM')}
                        >
                            <span className="payment-icon">🏦</span>
                            <span>BHIM</span>
                        </div>
                    </div>
                    {validationErrors.paymentMethod && (
                        <p className="validation-error">{validationErrors.paymentMethod}</p>
                    )}
                </div>
                
                <div className="qr-section">
                    <h3>Scan & Pay</h3>
                    <div className="qr-code">
                        {showQR ? (
                            <div className="qr-display">
                                <div className="qr-placeholder">QR Code</div>
                                <p>Scan using any UPI app to pay.</p>
                            </div>
                        ) : (
                            <button className="show-qr-btn" onClick={handleShowQR}>
                                Show QR Code
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="order-summary">
                <div className="summary-item">
                    <span>Items</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Delivery</span>
                    <span>₹{delivery.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                    <span>Total Due</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
            
            {error && <div className="payment-error">{error}</div>}
            
            <div className="checkout-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                </button>
                <button 
                    className="pay-btn" 
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Pay Securely'}
                </button>
            </div>
            
            <p className="help-text">
                Having trouble? Contact support or try another method.
            </p>
        </div>
    );
};

export default Checkout;