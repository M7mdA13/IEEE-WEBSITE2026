const BASE = `${import.meta.env.VITE_API_URL}/api/public`;

async function request(method, path, body, { signal } = {}) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (signal) opts.signal = signal;
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
  get:  (path, options)        => request('GET',  path, undefined, options),
  post: (path, body, options)  => request('POST', path, body, options),
};

export default api;
