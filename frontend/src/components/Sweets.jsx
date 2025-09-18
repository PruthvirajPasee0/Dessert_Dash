import React, { useEffect, useState } from 'react';
import { getAllSweets } from '../services/api';
import './Sweets.css';

const Sweets = () => {
    const [sweets, setSweets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSweets = async () => {
            try {
                const data = await getAllSweets();
                setSweets(data);
            } catch (err) {
                setError('Failed to fetch sweets');
                console.error(err);
            }
        };

        fetchSweets();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="sweets-container">
            <h2>Available Sweets</h2>
            <div className="sweets-grid">
                {sweets.map((sweet) => (
                    <div key={sweet.id} className="sweet-card">
                        <h3>{sweet.name}</h3>
                        <p>Category: {sweet.category}</p>
                        <p>Price: ₹{Number(sweet.price).toFixed(2)}</p>
                        <p>Available: {sweet.quantity}</p>
                        <button
                            onClick={() => handlePurchase(sweet.id)}
                            disabled={sweet.quantity === 0}
                        >
                            {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sweets;