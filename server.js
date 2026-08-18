require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Railway terminates TLS at its edge proxy, so req.ip is the proxy's address
// unless we trust one hop. Without this every visitor shares a single rate-limit
// bucket. Keep at 1 — trusting all hops lets clients spoof X-Forwarded-For.
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parsing & cookies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Rate limiting on auth endpoint only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later' },
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Auth (login is unauthenticated — mounted before admin guard)
app.use('/api/admin/auth', authLimiter, require('./routes/admin/auth.routes'));

// Public (no auth)
app.use('/api/public', require('./routes/public/index'));

// Admin (JWT required — applied inside the router)
app.use('/api/admin', require('./routes/admin/index'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'IEEE MUST API is running' });
});

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
