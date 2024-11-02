const API_BASE_URL = 'http://localhost:8090/api';

export const endpoints = {
        auth: {
            login: `${API_BASE_URL}/auth/login`,
            register: (hospitalId) => `${API_BASE_URL}/auth/register/hospital-admin/${hospitalId}`,
        principal: `${API_BASE_URL}/auth/principal`
    },
    hospitals: {
        list: `${API_BASE_URL}/hospitals`,
        byName: (name) => `${API_BASE_URL}/by-name?name=${name}`
    },
    transfer: {
        pending: `${API_BASE_URL}/transfer/pending`,
        completed: `${API_BASE_URL}/transfer/completed`,
        request: `${API_BASE_URL}/transfer/request`,
        upload: `${API_BASE_URL}/transfer/upload`
    },
    user: {
        update: (id) => `${API_BASE_URL}/user/${id}`
    }
};

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` })
    };

    console.log('Request Headers:', defaultHeaders);

    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle different response types
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            const data = await response.blob();
            return data;
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};
