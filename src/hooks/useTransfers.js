import { useState, useCallback } from 'react';
import { endpoints, apiRequest } from '../services/api';

export const useTransfers = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const [pending, completed] = await Promise.all([
                apiRequest(endpoints.transfer.pending),
                apiRequest(endpoints.transfer.completed)
            ]);
            setPendingRequests(pending);
            setCompletedRequests(completed);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        pendingRequests,
        completedRequests,
        loading,
        error,
        fetchRequests
    };
};