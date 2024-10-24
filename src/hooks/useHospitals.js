import { useState, useCallback } from 'react';
import { endpoints, apiRequest } from '../services/api';

export const useHospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHospitals = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiRequest(endpoints.hospitals.list);
            setHospitals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { hospitals, loading, error, fetchHospitals };
};
