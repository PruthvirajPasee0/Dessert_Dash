import React, { useEffect, useState } from 'react';
import { getAllSweets } from '../services/api';
import './Sweets.css';

const Sweets = () => {
    const [sweets, setSweets] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortConfig, setSortConfig] = useState({ field: '', order: 'asc' });
    const [categories, setCategories] = useState([]);

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
                        className={`sort-button ${sortConfig.field === 'name' ? 'active' : ''}`}
                    >
                        Name {sortConfig.field === 'name' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => handleSort('price')}
                        className={`sort-button ${sortConfig.field === 'price' ? 'active' : ''}`}
                    >
                        Price {sortConfig.field === 'price' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </button>
                </div>
            </div>

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