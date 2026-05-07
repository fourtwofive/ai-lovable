<script setup>
import { onMounted, ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useTransactionStore } from '../stores/transactionStore.js';

const store = useTransactionStore();
const router = useRouter();
const filter = ref('all');
const search = ref('');

onMounted(() => {
  if (store.transactions.length === 0) store.fetchTransactions();
});

const krw = (n) => new Intl.NumberFormat('ko-KR').format(n) + '원';

const filtered = computed(() => {
  return store.transactions.filter((t) => {
    if (filter.value !== 'all' && t.type !== filter.value) return false;
    if (search.value && !`${t.category}${t.description}`.includes(search.value)) return false;
    return true;
  });
});

const remove = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await store.deleteTransaction(id);
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0"><i class="fa-solid fa-list text-primary me-2"></i>거래내역</h2>
      <RouterLink to="/transactions/new" class="btn btn-primary">
        <i class="fa-solid fa-plus me-1"></i> 거래 추가
      </RouterLink>
    </div>

    <div class="card chart-card mb-3">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <select v-model="filter" class="form-select">
              <option value="all">전체</option>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              <input v-model="search" type="text" class="form-control" placeholder="카테고리 또는 내용 검색" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card chart-card">
      <div class="card-body">
        <div v-if="store.loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>날짜</th>
                <th>유형</th>
                <th>카테고리</th>
                <th>내용</th>
                <th class="text-end">금액</th>
                <th class="text-end">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in filtered" :key="t.id">
                <td class="text-muted">{{ t.id }}</td>
                <td>{{ t.date }}</td>
                <td>
                  <span v-if="t.type === 'income'" class="badge bg-success">수입</span>
                  <span v-else class="badge bg-danger">지출</span>
                </td>
                <td><span class="badge badge-cat">{{ t.category }}</span></td>
                <td>{{ t.description }}</td>
                <td class="text-end" :class="t.type === 'income' ? 'amount-income' : 'amount-expense'">
                  {{ t.type === 'income' ? '+' : '-' }}{{ krw(t.amount) }}
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <RouterLink :to="`/transactions/${t.id}`" class="btn btn-outline-secondary" title="상세">
                      <i class="fa-solid fa-eye"></i>
                    </RouterLink>
                    <RouterLink :to="`/transactions/${t.id}/edit`" class="btn btn-outline-warning" title="수정">
                      <i class="fa-solid fa-pen"></i>
                    </RouterLink>
                    <button class="btn btn-outline-danger" title="삭제" @click="remove(t.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filtered.length === 0">
                <td colspan="7" class="text-center text-muted py-4">결과가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-muted small mt-2">총 {{ filtered.length }}건</div>
      </div>
    </div>
  </div>
</template>
