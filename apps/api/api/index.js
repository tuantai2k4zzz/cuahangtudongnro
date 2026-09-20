require('reflect-metadata');

// BẮT BUỘC Vercel NFT (Node File Trace) phải gói các module này vào lambda!
require('@tudongnro/shared-types');

// Lấy handler từ file build chuẩn của NestJS
const main = require('../dist/main');

module.exports = async function (req, res) {
  try {
    const handler = main.default || main;
    return await handler(req, res);
  } catch (err) {
    console.error('Vercel Handler Error:', err);
    res.status(500).json({
      error: 'Vercel API Handler Failed',
      message: err.message,
      stack: err.stack
    });
  }
};
