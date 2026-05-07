<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTransactionStore } from '../stores/transactionStore.js';

const props = defineProps({ id: { type: [String, Number], default: null } });
const store = useTransactionStore();
const router = useRouter();

const isEdit = computed(() => props.id !== null && props.id !== undefined && props.id !== '');

const form = reactive({
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  category: '식비',
  description: '',
  amount: 0
});

const categories = ['식비', '교통', '쇼핑', '문화생활', '주거', '의료', '교육', '경조사', '급여', '기타수입'];
const submitting = ref(false);
const error = ref('');

const loadForEdit = () => {
  if (!isEdit.value) return;
  const t = store.transactions.find((x) => String(x.id) === String(props.id));
  if (t) Object.assign(form, t);
};

onMounted(async () => {
  if (store.transactions.length === 0) await store.fetchTransactions();
  loadForEdit();
});
watch(() => store.transactions.length, loadForEdit);

const submit = async () => {
  if (!form.description || !form.amount) {
    error.value = '내용과 금액을 입력하세요.';
    return;
  }
  submitting.value = true;
  error.value = '';
  try {
    const payload = { ...form, amount: Number(form.amount) };
    if (isEdit.value) {
      await store.updateTransaction(props.id, payload);
    } else {
      await store.addTransaction(payload);
    }
    router.push('/transactions');
  } catch (e) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div>
    <h2 class="mb-4">
      <i class="fa-solid" :class="isEdit ? 'fa-pen text-warning' : 'fa-plus text-primary'"></i>
      {{ isEdit ? ' 거래 수정' : ' 거래 추가' }}
    </h2>
    <div class="card chart-card">
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">날짜</label>
              <input v-model="form.date" type="date" class="form-control" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">유형</label>
              <select v-model="form.type" class="form-select">
                <option value="income">수입</option>
                <option value="expense">지출</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">카테고리</label>
              <select v-model="form.category" class="form-select">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="col-md-8">
              <label class="form-label">내용</label>
              <input v-model="form.description" type="text" class="form-control" placeholder="예: 점심식사" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">금액 (원)</label>
              <input v-model.number="form.amount" type="number" min="0" class="form-control" required />
            </div>
          </div>
          <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
          <div class="mt-4 d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <i class="fa-solid fa-save me-1"></i> {{ isEdit ? '수정' : '저장' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="router.back()">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
