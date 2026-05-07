# 가계부 대시보드 (Vue 3 + json-server)

Vue 3 Composition API · Pinia · Vue Router · Bootstrap 5 · Google Charts · Font Awesome · Axios · json-server (ES6)

## 설치 및 실행

```bash
npm install
npm start          # json-server(:3001) + vite(:5173) 동시 실행
```

또는 따로 실행:

```bash
npm run server     # http://localhost:3001
npm run dev        # http://localhost:5173
```

## 폴더 구조

```
src/
├── api/axios.js              # axios 인스턴스 (baseURL: localhost:3001)
├── stores/transactionStore.js # Pinia store - json-server 연결
├── router/index.js
├── views/
│   ├── Dashboard.vue         # 통계 카드 + Google Charts (Column/Pie/Line)
│   └── Transactions.vue      # 거래내역 + 필터/검색
├── components/StatCard.vue
└── assets/style.css

server/db.json                # 샘플 거래 100건
```

## 주요 기능

- 대시보드: 총 수입/지출/잔액/거래수, 월별 수입·지출 차트, 카테고리별 도넛 차트, 누적 잔액 라인 차트, 최근 거래 테이블
- 거래내역: 유형 필터, 텍스트 검색
- Pinia store에서 axios로 GET/POST/PUT/DELETE 모두 구현
