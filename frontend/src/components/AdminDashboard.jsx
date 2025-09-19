import React, { useState, useEffect } from 'react';
import sweetService from '../services/sweetService';

const AdminDashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [editingId, setEditingId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await sweetService.updateSweet(editingId, formData);
            } else {
                await sweetService.createSweet(formData);
            }
            fetchSweets();
            setFormData({ name: '', category: '', price: '', quantity: '' });
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
            quantity: sweet.quantity.toString()
        });
        setEditingId(sweet.id);
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
            <h2>Sweet Management</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="sweet-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Sweet name"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    step="0.01"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    required
                />
                <button type="submit">
                    {editingId ? 'Update Sweet' : 'Add Sweet'}
                </button>
                {editingId && (
                    <button type="button" onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', category: '', price: '', quantity: '' });
                    }}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="sweets-list">
                <table>
                    <thead>
                        <tr>
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
                                <td>{sweet.name}</td>
                                <td>{sweet.category}</td>
                                <td>${sweet.price}</td>
                                <td>{sweet.quantity}</td>
                                <td>
                                    <button onClick={() => handleEdit(sweet)}>Edit</button>
                                    <button onClick={() => handleQuantityAdjust(sweet.id, sweet.quantity)}>
                                        Restock
                                    </button>
                                    <button onClick={() => handleDelete(sweet.id)}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="no-data">No sweets data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;