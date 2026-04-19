const BASE = `${import.meta.env.VITE_API_URL}/api/public`;

async function request(method, path, body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || res.statusText);
    err.response = { data: json };
    throw err;
  }
  return { data: json };
}

const api = {
  get:  (path)        => request('GET',  path),
  post: (path, body)  => request('POST', path, body),
};

export default api;
