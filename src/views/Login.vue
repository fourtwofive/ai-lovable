<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const submit = async () => {
  try {
    await auth.login(form);
    router.push('/');
  } catch {
    // Error message handled by store state.
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 460px;">
    <div class="card chart-card">
      <div class="card-body p-4">
        <h3 class="mb-3"><i class="fa-solid fa-right-to-bracket text-primary me-2"></i>로그인</h3>
        <p class="text-muted mb-4">가계부 서비스를 이용하려면 로그인하세요.</p>

        <form @submit.prevent="submit" class="d-grid gap-3">
          <div>
            <label class="form-label">이메일</label>
            <input v-model.trim="form.email" type="email" class="form-control" required />
          </div>
          <div>
            <label class="form-label">비밀번호</label>
            <input v-model="form.password" type="password" class="form-control" required />
          </div>
          <div v-if="auth.error" class="alert alert-danger py-2 mb-0">{{ auth.error }}</div>
          <button type="submit" class="btn btn-primary" :disabled="auth.loading">
            <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>
            로그인
          </button>
        </form>

        <div class="mt-3 text-center">
          계정이 없나요?
          <RouterLink to="/signup" class="text-decoration-none">회원가입</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
