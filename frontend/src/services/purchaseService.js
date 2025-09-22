import api from './api';

const API_URL = '/purchases';

const purchaseService = {
    getAllPurchases: async () => {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching purchases:', error);
            throw error;
        }
    },

    deletePurchase: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting purchase:', error);
            throw error;
        }
    },

    getUserPurchases: async () => {
        try {
            const response = await api.get(`${API_URL}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user purchases:', error);
            throw error;
        }
    }
};

export default purchaseService;