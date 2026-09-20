let cachedHandler;

module.exports = async function (req, res) {
  // 1. CORS Headers trực tiếp tại Vercel Function: Ngăn chặn triệt để lỗi PreflightMissingAllowOriginHeader
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-signature');

  // Trả về 200 OK ngay lập tức cho các OPTIONS Preflight request từ trình duyệt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!cachedHandler) {
      require('reflect-metadata');
      try {
        require('@tudongnro/shared-types');
      } catch (e) {
        console.warn('Optional require @tudongnro/shared-types:', e.message);
      }
      const main = require('../dist/main');
      cachedHandler = main.default || main;
    }
    return await cachedHandler(req, res);
  } catch (err) {
    console.error('Vercel API Handler Error:', err);
    return res.status(500).json({
      error: 'Vercel API Handler Failed',
      message: err.message,
      stack: err.stack,
      env_check: {
        has_mongodb: !!process.env.MONGODB_URI,
        has_jwt_access: !!process.env.JWT_ACCESS_SECRET,
        client_url: process.env.CLIENT_URL,
        node_env: process.env.NODE_ENV
      }
    });
  }
};
