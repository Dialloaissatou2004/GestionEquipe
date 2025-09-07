const allowedOrigins = [
  // Development origins
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Production origins (add your production domain)
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL
].filter(Boolean); // Remove undefined values

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Always set CORS headers for development
  if (process.env.NODE_ENV === 'production') {
    // In production, be restrictive
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  } else {
    // In development, be more permissive but still secure
    if (origin) {
      if (origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
    } else {
      // Handle requests without origin (like Postman, direct server calls)
      res.header('Access-Control-Allow-Origin', '*');
    }
  }
  
  // Always set these headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`CORS Preflight: ${origin} → ${req.url}`);
    return res.status(200).end();
  }

  // Log CORS requests for debugging
  if (origin) {
    console.log(`CORS Request: ${origin} → ${req.method} ${req.url}`);
  }

  next();
};

module.exports = corsMiddleware;
