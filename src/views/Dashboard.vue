<script setup>
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { GChart } from 'vue-google-charts';
import { useTransactionStore } from '../stores/transactionStore.js';
import StatCard from '../components/StatCard.vue';

const store = useTransactionStore();

onMounted(() => {
  if (store.transactions.length === 0) store.fetchTransactions();
});

const krw = (n) => new Intl.NumberFormat('ko-KR').format(n) + '원';

// 월별 수입/지출 (Combo)
const monthlyChartData = computed(() => {
  const rows = [['월', '수입', '지출']];
  store.monthlySummary.forEach((m) => rows.push([m.month, m.income, m.expense]));
  return rows;
});
const monthlyChartOptions = {
  title: '월별 수입 / 지출',
  legend: { position: 'bottom' },
  chartArea: { width: '85%', height: '70%' },
  colors: ['#10b981', '#ef4444'],
  bar: { groupWidth: '60%' }
};

// 카테고리별 지출 (Pie)
const categoryChartData = computed(() => {
  const rows = [['카테고리', '금액']];
  Object.entries(store.expenseByCategory).forEach(([k, v]) => rows.push([k, v]));
  return rows;
});
const categoryChartOptions = {
  title: '카테고리별 지출',
  pieHole: 0.45,
  legend: { position: 'right' },
  chartArea: { width: '95%', height: '80%' },
  colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16', '#f97316', '#14b8a6']
};

// 누적 잔액 흐름 (Line)
const trendChartData = computed(() => {
  const rows = [['일자', '누적 잔액']];
  const sorted = [...store.transactions].sort((a, b) => a.date.localeCompare(b.date));
  let acc = 0;
  sorted.forEach((t) => {
    acc += t.type === 'income' ? t.amount : -t.amount;
    rows.push([t.date, acc]);
  });
  return rows;
});
const trendChartOptions = {
  title: '누적 잔액 추이',
  legend: { position: 'none' },
  colors: ['#4f46e5'],
  chartArea: { width: '88%', height: '75%' },
  curveType: 'function'
};

const recent = computed(() => store.transactions.slice(0, 8));
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0"><i class="fa-solid fa-gauge-high text-primary me-2"></i>대시보드</h2>
      <div class="d-flex gap-2">
        <RouterLink to="/transactions/new" class="btn btn-primary">
          <i class="fa-solid fa-plus me-1"></i> 거래 추가
        </RouterLink>
        <button class="btn btn-outline-primary" @click="store.fetchTransactions">
          <i class="fa-solid fa-rotate me-1"></i> 새로고침
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="store.error" class="alert alert-danger">
      <i class="fa-solid fa-triangle-exclamation me-2"></i>
      {{ store.error }} — json-server가 실행 중인지 확인하세요 (npm run server).
    </div>

    <template v-else>
      <!-- 통계 카드 -->
      <div class="row g-3 mb-4">
        <div class="col-md-6 col-xl-3">
          <StatCard label="총 수입" :value="krw(store.totalIncome)" icon="fa-solid fa-arrow-trend-up" variant="income" />
        </div>
        <div class="col-md-6 col-xl-3">
          <StatCard label="총 지출" :value="krw(store.totalExpense)" icon="fa-solid fa-arrow-trend-down" variant="expense" />
        </div>
        <div class="col-md-6 col-xl-3">
          <StatCard label="잔액" :value="krw(store.balance)" icon="fa-solid fa-piggy-bank" variant="balance" />
        </div>
        <div class="col-md-6 col-xl-3">
          <StatCard label="거래 건수" :value="store.transactions.length + ' 건'" icon="fa-solid fa-receipt" variant="count" />
        </div>
      </div>

      <!-- 차트 -->
      <div class="row g-3 mb-4">
        <div class="col-lg-7">
          <div class="card chart-card">
            <div class="card-body">
              <GChart type="ColumnChart" :data="monthlyChartData" :options="monthlyChartOptions" :resizeDebounce="50" style="height: 360px" />
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card chart-card">
            <div class="card-body">
              <GChart type="PieChart" :data="categoryChartData" :options="categoryChartOptions" :resizeDebounce="50" style="height: 360px" />
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12">
          <div class="card chart-card">
            <div class="card-body">
              <GChart type="LineChart" :data="trendChartData" :options="trendChartOptions" :resizeDebounce="50" style="height: 320px" />
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 거래 -->
      <div class="card chart-card">
        <div class="card-body">
          <h5 class="card-title mb-3"><i class="fa-solid fa-clock-rotate-left me-2 text-secondary"></i>최근 거래</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>날짜</th>
                  <th>유형</th>
                  <th>카테고리</th>
                  <th>내용</th>
                  <th class="text-end">금액</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in recent" :key="t.id" style="cursor:pointer" @click="$router.push(`/transactions/${t.id}`)">
                  <td>{{ t.date }}</td>
                  <td>
                    <span v-if="t.type === 'income'" class="badge bg-success">
                      <i class="fa-solid fa-plus me-1"></i>수입
                    </span>
                    <span v-else class="badge bg-danger">
                      <i class="fa-solid fa-minus me-1"></i>지출
                    </span>
                  </td>
                  <td><span class="badge badge-cat">{{ t.category }}</span></td>
                  <td>{{ t.description }}</td>
                  <td class="text-end" :class="t.type === 'income' ? 'amount-income' : 'amount-expense'">
                    {{ t.type === 'income' ? '+' : '-' }}{{ krw(t.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
