<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  email: '',
  name: '',
  password: ''
});

const submit = async () => {
  try {
    await auth.signup(form);
    router.push('/');
  } catch {
    // Error message handled by store state.
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 520px;">
    <div class="card chart-card">
      <div class="card-body p-4">
        <h3 class="mb-3"><i class="fa-solid fa-user-plus text-primary me-2"></i>회원가입</h3>
        <p class="text-muted mb-4">이메일, 이름, 비밀번호를 입력해 계정을 만드세요.</p>

        <form @submit.prevent="submit" class="d-grid gap-3">
          <div>
            <label class="form-label">이메일</label>
            <input v-model.trim="form.email" type="email" class="form-control" required />
          </div>
          <div>
            <label class="form-label">이름</label>
            <input v-model.trim="form.name" type="text" class="form-control" required />
          </div>
          <div>
            <label class="form-label">비밀번호</label>
            <input v-model="form.password" type="password" class="form-control" minlength="4" required />
          </div>
          <div v-if="auth.error" class="alert alert-danger py-2 mb-0">{{ auth.error }}</div>
          <button type="submit" class="btn btn-primary" :disabled="auth.loading">
            <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>
            회원가입
          </button>
        </form>

        <div class="mt-3 text-center">
          이미 계정이 있나요?
          <RouterLink to="/login" class="text-decoration-none">로그인</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
