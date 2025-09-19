import React, { useEffect, useState } from 'react';
import { getAllSweets } from '../services/api';
import { useCart } from '../context/CartContext';
import './Sweets.css';

const Sweets = () => {
    const [sweets, setSweets] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortConfig, setSortConfig] = useState({ field: '', order: 'asc' });
    const [categories, setCategories] = useState([]);
    const { addToCart } = useCart();

    const fetchSweets = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (selectedCategory) queryParams.append('category', selectedCategory);
            if (priceRange.min) queryParams.append('minPrice', priceRange.min);
            if (priceRange.max) queryParams.append('maxPrice', priceRange.max);
            if (sortConfig.field) {
                queryParams.append('sortBy', sortConfig.field);
                queryParams.append('sortOrder', sortConfig.order);
            }

            const data = await getAllSweets(queryParams);
            setSweets(data);

            // Extract unique categories
            const uniqueCategories = [...new Set(data.map(sweet => sweet.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            setError('Failed to fetch sweets');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, sortConfig]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePriceRangeChange = (type, value) => {
        setPriceRange(prev => ({ ...prev, [type]: value }));
    };

    const handlePurchase = (sweetId) => {
        const sweet = sweets.find(s => s.id === sweetId);
        if (sweet) {
            addToCart(sweet);
            // Show a brief notification or feedback
            const notification = document.createElement('div');
            notification.className = 'add-to-cart-notification';
            notification.textContent = `${sweet.name} added to cart!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 2000);
            }, 10);
        }
    };

    const themes = ['theme-artisan', 'theme-joyful', 'theme-warm'];

    return (
        <div className="sweets-container">
            <h2>Available Sweets</h2>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search sweets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                <div className="price-range">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        className="price-input"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        className="price-input"
                    />
                </div>

                <div className="sort-buttons">
                    <button
                        onClick={() => handleSort('name')}
                        className={`sort-button ${sortConfig.field === 'name' ? 'active' : ''}`}>
                        Name {sortConfig.field === 'name' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => handleSort('price')}
                        className={`sort-button ${sortConfig.field === 'price' ? 'active' : ''}`}>
                        Price {sortConfig.field === 'price' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </button>
                </div>
            </div>

            <div className="sweets-grid">
                {sweets.map((sweet, index) => {
                    const theme = themes[index % themes.length];
                    return (
                        <div key={sweet.id} className={`sweet-card ${theme}`}>
                            <div className="sweet-image-container">
                                {sweet.imageUrl ? (
                                    <img
                                        src={sweet.imageUrl}
                                        alt={sweet.name}
                                        className="sweet-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-sweet.png';
                                            e.target.onerror = null;
                                        }}
                                    />
                                ) : (
                                    <div className="placeholder-image">
                                        A Picture's Worth a Thousand Words But We Don't Have One Yet!
                                    </div>
                                )}
                            </div>
                            <div className="sweet-details">
                                <h3>{sweet.name}</h3>
                                <p>{sweet.category}</p>
                                <div className="price-quantity-container">
                                    <p className="price">₹{Number(sweet.price).toFixed(2)}</p>
                                    <span className="quantity-badge">{sweet.quantity} left</span>
                                </div>
                                <div className="sweet-actions">
                                    <button
                                        onClick={() => handlePurchase(sweet.id)}
                                        disabled={sweet.quantity === 0}
                                        className="add-to-cart-btn"
                                    >
                                        {sweet.quantity > 0 ? 'Add to cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sweets;