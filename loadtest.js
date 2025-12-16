import http from 'k6/http';
import { sleep, check } from 'k6';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcsImVtYWlsIjoibWt0MkBleGFtcGxlLmNvbSIsInVzZXJ0eXBlIjoibWFya2V0aW5nIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NjU3OTAyNzAsImV4cCI6MTc2NTc5Mzg3MH0._ks_d4ZKdydQG4y5cFlwasKR0iYAurvi_6K298gVdEk';

export const options = {
  stages: [
    { duration: '30s', target: 10000 }, // ⚠️ brutal, turunin kalau perlu
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(
    'http://192.182.6.69:8000/api-v1/loan-app/mkt/ext/loan-apps/detail/4',
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
