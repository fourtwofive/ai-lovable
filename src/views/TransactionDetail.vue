<script setup>
import { computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useTransactionStore } from '../stores/transactionStore.js';

const props = defineProps({ id: { type: [String, Number], required: true } });
const store = useTransactionStore();
const router = useRouter();

onMounted(() => {
  if (store.transactions.length === 0) store.fetchTransactions();
});

const tx = computed(() => store.transactions.find((t) => String(t.id) === String(props.id)));
const krw = (n) => new Intl.NumberFormat('ko-KR').format(n) + '원';

const remove = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await store.deleteTransaction(tx.value.id);
  router.push('/transactions');
};
</script>

<template>
  <div>
    <h2 class="mb-4"><i class="fa-solid fa-receipt text-primary me-2"></i>거래 상세</h2>
    <div v-if="!tx" class="alert alert-warning">거래를 찾을 수 없습니다.</div>
    <div v-else class="card chart-card">
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-3">ID</dt><dd class="col-sm-9">{{ tx.id }}</dd>
          <dt class="col-sm-3">날짜</dt><dd class="col-sm-9">{{ tx.date }}</dd>
          <dt class="col-sm-3">유형</dt>
          <dd class="col-sm-9">
            <span :class="['badge', tx.type === 'income' ? 'bg-success' : 'bg-danger']">
              {{ tx.type === 'income' ? '수입' : '지출' }}
            </span>
          </dd>
          <dt class="col-sm-3">카테고리</dt><dd class="col-sm-9"><span class="badge badge-cat">{{ tx.category }}</span></dd>
          <dt class="col-sm-3">내용</dt><dd class="col-sm-9">{{ tx.description }}</dd>
          <dt class="col-sm-3">금액</dt>
          <dd class="col-sm-9" :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'">
            {{ tx.type === 'income' ? '+' : '-' }}{{ krw(tx.amount) }}
          </dd>
        </dl>
        <hr />
        <div class="d-flex gap-2">
          <RouterLink :to="`/transactions/${tx.id}/edit`" class="btn btn-warning">
            <i class="fa-solid fa-pen me-1"></i> 수정
          </RouterLink>
          <button class="btn btn-danger" @click="remove">
            <i class="fa-solid fa-trash me-1"></i> 삭제
          </button>
          <RouterLink to="/transactions" class="btn btn-outline-secondary ms-auto">목록으로</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
