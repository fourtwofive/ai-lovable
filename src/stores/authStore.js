import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '../api/axios.js';

const STORAGE_KEY = 'budget-auth-user';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const stripPassword = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readStoredUser());
  const loading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!user.value);

  const clearError = () => {
    error.value = '';
  };

  const signup = async ({ email, name, password }) => {
    loading.value = true;
    clearError();
    try {
      const { data: existing } = await api.get('/users', { params: { email } });
      if (existing.length > 0) {
        throw new Error('이미 가입된 이메일입니다.');
      }

      const payload = {
        email,
        name,
        password,
        createdAt: new Date().toISOString()
      };
      const { data } = await api.post('/users', payload);
      user.value = stripPassword(data);
      saveUser(user.value);
    } catch (e) {
      error.value = e.message || '회원가입에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const login = async ({ email, password }) => {
    loading.value = true;
    clearError();
    try {
      const { data } = await api.get('/users', { params: { email } });
      const found = data[0];
      if (!found || found.password !== password) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      user.value = stripPassword(found);
      saveUser(user.value);
    } catch (e) {
      error.value = e.message || '로그인에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    clearError();
    saveUser(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signup,
    login,
    logout,
    clearError
  };
});
