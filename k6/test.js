import http from 'k6/http';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus: 2000,
      duration: '1m',
    },
  },
};

export default function () {
  http.get('http://localhost:3000/api/users/5');
}
