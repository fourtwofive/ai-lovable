import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import TransactionForm from '../views/TransactionForm.vue';
import TransactionDetail from '../views/TransactionDetail.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { public: true } },
    { path: '/signup', name: 'signup', component: Signup, meta: { public: true } },
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/transactions', name: 'transactions', component: Transactions },
    { path: '/transactions/new', name: 'transaction-new', component: TransactionForm },
    { path: '/transactions/:id', name: 'transaction-detail', component: TransactionDetail, props: true },
    { path: '/transactions/:id/edit', name: 'transaction-edit', component: TransactionForm, props: true }
  ]
});

router.beforeEach((to) => {
  const storedUser = localStorage.getItem('budget-auth-user');
  const isAuthenticated = !!storedUser;
  const isPublic = !!to.meta.public;

  if (!isAuthenticated && !isPublic) return { name: 'login' };
  if (isAuthenticated && isPublic) return { name: 'dashboard' };
  return true;
});

export default router;
