import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PurchaseSuccess.css';

const PurchaseSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total } = location.state || { orderId: 'Unknown', total: '0.00' };

    return (
        <div className="purchase-success-container">
            <div className="success-card">
                <div className="success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p className="order-id">Order ID: {orderId}</p>
                <p className="amount">Amount Paid: ₹{total}</p>
                <p className="thank-you">Thank you for your purchase!</p>
                <p className="message">Your order has been confirmed and will be delivered soon.</p>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default PurchaseSuccess;