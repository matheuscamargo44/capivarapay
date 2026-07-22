import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function usePixCharge() {
  const [charge, setCharge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCharge = useCallback(async (amount, description = 'Cobranca Pix Capivara Pay') => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.createCharge({
        amount,
        description,
        correlation_id: `corr_${Date.now()}`
      });

      setCharge(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const simulatePayment = useCallback(async (chargeId) => {
    if (!chargeId) return;

    setLoading(true);
    try {
      const response = await apiClient.payCharge(chargeId);
      setCharge(prev => prev ? { ...prev, status: 'PAID' } : null);
      return response.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    charge,
    loading,
    error,
    createCharge,
    simulatePayment
  };
}
