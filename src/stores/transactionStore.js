import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios.js';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ===== json-server 연결 (axios) =====
  const fetchTransactions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get('/transactions');
      transactions.value = data;
    } catch (e) {
      error.value = e.message;
      console.error('Failed to fetch transactions:', e);
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (payload) => {
    const { data } = await api.post('/transactions', payload);
    transactions.value.unshift(data);
  };

  const updateTransaction = async (id, payload) => {
    const { data } = await api.put(`/transactions/${id}`, payload);
    const idx = transactions.value.findIndex((t) => t.id === id);
    if (idx !== -1) transactions.value[idx] = data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  };

  // ===== 계산된 값 =====
  const totalIncome = computed(() =>
    transactions.value.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  );
  const totalExpense = computed(() =>
    transactions.value.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  );
  const balance = computed(() => totalIncome.value - totalExpense.value);

  const expenseByCategory = computed(() => {
    const map = {};
    transactions.value
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  });

  const monthlySummary = computed(() => {
    const map = {};
    transactions.value.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = { income: 0, expense: 0 };
      map[month][t.type] += t.amount;
    });
    return Object.keys(map)
      .sort()
      .map((m) => ({ month: m, ...map[m] }));
  });

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    monthlySummary
  };
});
