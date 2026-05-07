<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
const collapsed = ref(false);
</script>

<template>
  <div class="app-wrapper d-flex">
    <aside class="sidebar bg-dark text-white" :class="{ collapsed }">
      <div class="sidebar-header d-flex align-items-center justify-content-between p-3">
        <RouterLink to="/" class="brand text-white text-decoration-none fw-bold" v-if="!collapsed">
          <i class="fa-solid fa-wallet me-2 text-warning"></i>가계부
        </RouterLink>
        <button class="btn btn-sm btn-outline-light" @click="collapsed = !collapsed">
          <i :class="collapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'"></i>
        </button>
      </div>
      <ul class="nav flex-column px-2">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link text-white" active-class="active" exact-active-class="active">
            <i class="fa-solid fa-chart-line"></i> <span v-if="!collapsed" class="ms-2">대시보드</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/transactions" class="nav-link text-white" active-class="active">
            <i class="fa-solid fa-list"></i> <span v-if="!collapsed" class="ms-2">거래내역</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/transactions/new" class="nav-link text-white" active-class="active">
            <i class="fa-solid fa-plus"></i> <span v-if="!collapsed" class="ms-2">거래 추가</span>
          </RouterLink>
        </li>
      </ul>
    </aside>
    <main class="flex-grow-1 p-4 main-content">
      <RouterView />
    </main>
  </div>
</template>
