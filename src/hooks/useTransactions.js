import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCharges();
      setTransactions(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const totalVolume = transactions
    .filter(t => t.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCount = transactions.filter(t => t.status === 'PAID').length;

  return {
    transactions,
    loading,
    error,
    totalVolume,
    totalCount,
    refetch: fetchTransactions,
    addTransaction
  };
}
