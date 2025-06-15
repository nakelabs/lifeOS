
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FinancialRecord {
  id: string;
  type: string;
  amount: number;
  category: string | null;
  description: string | null;
  currency: string | null;
  recorded_at: string | null;
  created_at: string | null;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    } else {
      setFinancialData([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFinancialData = async () => {
    if (!user) return;

    try {
      console.log('Fetching financial data for user:', user.id);
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching financial data:', error);
        return;
      }

      console.log('Fetched financial data:', data);
      setFinancialData(data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalIncome = () => {
    return financialData
      .filter(record => record.type === 'income')
      .reduce((total, record) => total + record.amount, 0);
  };

  const getTotalExpenses = () => {
    return financialData
      .filter(record => record.type === 'expense')
      .reduce((total, record) => total + record.amount, 0);
  };

  const getNetWorth = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return {
    financialData,
    loading,
    getTotalIncome,
    getTotalExpenses,
    getNetWorth,
    refetch: fetchFinancialData
  };
};
