import api from './api';

const API_URL = '/sweets';

const sweetService = {
    getAllSweets: async (queryParams = null) => {
        try {
            const url = queryParams ? `${API_URL}?${new URLSearchParams(queryParams)}` : API_URL;
            const response = await api.get(url);
            if (!response.data) {
                console.error('No data received from API');
                return [];
            }
            if (!Array.isArray(response.data)) {
                console.error('Received data is not an array:', response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching sweets:', error);
            throw error;
        }
    },

    createSweet: async (sweetData) => {
        const response = await api.post(API_URL, sweetData);
        return response.data;
    },

    updateSweet: async (id, sweetData) => {
        const response = await api.put(`${API_URL}/${id}`, sweetData);
        return response.data;
    },

    deleteSweet: async (id) => {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    },

    adjustQuantity: async (id, quantity) => {
        const response = await api.patch(`${API_URL}/${id}/quantity`, { quantity });
        return response.data;
    }
};

export default sweetService;