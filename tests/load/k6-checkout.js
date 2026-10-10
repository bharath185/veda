import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 200 },  // Ramp-up to 200 users
    { duration: '1m', target: 1000 },  // Scale to 1000 concurrent users
    { duration: '30s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'], // 95% requests must complete within 250ms
    http_req_failed: ['rate<0.01'],   // Error rate must stay below 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

export default function () {
  // 1. Hit Products Listing
  const listRes = http.get(`${BASE_URL}/products?page=1&limit=20`);
  check(listRes, {
    'products list status is 200': (r) => r.status === 200,
  });

  // 2. Perform Full-Text Product Search
  const searchRes = http.get(`${BASE_URL}/products/search?q=Aura`);
  check(searchRes, {
    'product search status is 200': (r) => r.status === 200,
  });

  // 3. Query Product Details with JSON-LD
  const slugRes = http.get(`${BASE_URL}/products/aura-pro-5g-smartphone`);
  check(slugRes, {
    'product slug status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
