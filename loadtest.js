import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 }, // Ramp up to 20 VU (virtual users)
    { duration: '1m', target: 500 }, // Stay at 20 VU for 1 min (stress)
    { duration: '30s', target: 1500 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests <500ms
    http_req_failed: ['rate<0.01'], // Error rate <1%
  },
};

export default function () {
  const res = http.get('http://192.182.6.69:8000/api-v1/loan-app'); // Ganti endpoint NestJS kamu
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1); // Simulate user think time
}
