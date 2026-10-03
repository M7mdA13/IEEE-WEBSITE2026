import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // send the httpOnly cookie on every request automatically
})

// The dashboard (vercel.app) and API (railway.app) are different sites, so the
// login cookie is third-party. Safari and every iOS browser block those, which
// logged phones straight back out. The login response also returns the token;
// we send it as a Bearer header so auth works whether or not the cookie survives.
export const TOKEN_KEY = 'authToken'

export function clearSession() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  localStorage.removeItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear the session and redirect to login.
// A failed login is also a 401 — let the login page show its error instead.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes('/admin/auth/login')
    if (err.response?.status === 401 && !isLoginRequest) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
