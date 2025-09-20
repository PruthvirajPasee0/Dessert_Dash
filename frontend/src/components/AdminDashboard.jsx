import React, { useState, useEffect, useRef } from 'react';
import sweetService from '../services/sweetService';

const AdminDashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        imageUrl: ''
    });
    const [editingId, setEditingId] = useState(null);
    const nameInputRef = useRef(null);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const data = await sweetService.getAllSweets();
            if (!data || data.length === 0) {
                setError('No sweets available in the database');
                setSweets([]);
            } else {
                setSweets(data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching sweets:', err);
            setError('Failed to fetch sweets. Please try again.');
            setSweets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateImageUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrl && !validateImageUrl(formData.imageUrl)) {
                setError('Please enter a valid image URL');
                return;
            }

            if (editingId) {
                await sweetService.updateSweet(editingId, formData);
            } else {
                await sweetService.createSweet(formData);
            }
            fetchSweets();
            setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' });
            setEditingId(null);
            setError(null);
        } catch (err) {
            setError(editingId ? 'Failed to update sweet' : 'Failed to create sweet');
        }
    };

    const handleEdit = (sweet) => {
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price.toString(),
            quantity: sweet.quantity.toString(),
            imageUrl: sweet.imageUrl || ''
        });
        setEditingId(sweet.id);
        nameInputRef.current.focus();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await sweetService.deleteSweet(id);
                fetchSweets();
                setError(null);
            } catch (err) {
                setError('Failed to delete sweet');
            }
        }
    };

    const handleQuantityAdjust = async (id, currentQuantity) => {
        const newQuantity = prompt('Enter new quantity: ', currentQuantity);
        if (newQuantity === null || isNaN(newQuantity)) {
            return;
        }
        
        try {
            await sweetService.adjustQuantity(id, parseInt(newQuantity));
            await fetchSweets();
            setError(null);
        } catch (err) {
            console.error('Error adjusting quantity:', err);
            setError(err.response?.data?.message || 'Failed to adjust quantity');
        }
    };


    if (loading) return <div className="loading-state">Loading sweets data...</div>;

    return (
        <div className="admin-dashboard">

            {error && <div className="error-message">{error}</div>}

            <div className="add-edit-sweet-section">
                <h3>Add / Edit Sweet</h3>
                <p>Craft your confection — keep details simple and clear.</p>
                <form onSubmit={handleSubmit} className="sweet-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Cocoa Truffles"
                                required
                                ref={nameInputRef}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="string"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="Donut..."
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="$0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="imageUrl">Image URL</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://images.unsplash.com/photo-..."
                        />
                        <p className="help-text">Paste a direct image link to your sweet. PNG or JPG recommended.</p>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="reset-button" onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' });
                        }}>
                            Reset
                        </button>
                        <button type="submit" className="save-button">
                            {editingId ? 'Update Sweet' : 'Save Sweet'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="sweet-catalog-section">
                <h3>Sweet Catalog</h3>
                <p>Browse all sweets in your shop</p>
                <button className="add-sweet-button" onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' });
                    nameInputRef.current.focus();
                }}>
                    + Add Sweet
                </button>
                <div className="sweets-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sweets && Array.isArray(sweets) ? sweets.map(sweet => (
                                <tr key={sweet.id}>
                                    <td>
                                        {sweet.imageUrl ? (
                                            <img
                                                src={sweet.imageUrl}
                                                alt={sweet.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                onError={(e) => e.target.src = '/placeholder-profile.png'}
                                            />
                                        ) : (
                                            <img
                                                src="/placeholder-profile.png"
                                                alt="placeholder"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </td>
                                    <td>{sweet.name}</td>
                                    <td>{sweet.category}</td>
                                    <td>${sweet.price}</td>
                                    <td>{sweet.quantity}</td>
                                    <td className="sweet-actions">
                                        <button className="edit-button" onClick={() => handleEdit(sweet)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(sweet.id)}>Delete</button>
                                        <button className="restock-button" onClick={() => handleQuantityAdjust(sweet.id, sweet.quantity)}>
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="no-data">No sweets data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;