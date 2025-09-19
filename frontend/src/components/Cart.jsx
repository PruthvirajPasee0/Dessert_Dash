import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is looking a little lonely</h2>
                <button onClick={() => navigate('/sweets')} className="continue-shopping">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="cart-item-image"
                            onError={(e) => {
                                e.target.src = '/placeholder-sweet.png';
                                e.target.onerror = null;
                            }}
                        />
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p className="price">₹{item.price}</p>
                        </div>
                        <div className="quantity-controls">
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="quantity-btn"
                            >
                                -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="quantity-btn"
                            >
                                +
                            </button>
                        </div>
                        <div className="item-total">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="checkout-btn">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;