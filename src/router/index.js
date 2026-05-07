import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import TransactionForm from '../views/TransactionForm.vue';
import TransactionDetail from '../views/TransactionDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/transactions', name: 'transactions', component: Transactions },
    { path: '/transactions/new', name: 'transaction-new', component: TransactionForm },
    { path: '/transactions/:id', name: 'transaction-detail', component: TransactionDetail, props: true },
    { path: '/transactions/:id/edit', name: 'transaction-edit', component: TransactionForm, props: true }
  ]
});

export default router;
