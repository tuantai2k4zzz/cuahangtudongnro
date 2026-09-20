export default async function (req: any, res: any) {
  try {
    const mod = require('../dist/main');
    const handler = mod.default || mod;
    return await handler(req, res);
  } catch (err: any) {
    console.error('Vercel API Index Error:', err);
    res.status(500).json({
      error: 'Vercel API Index Require Failed',
      message: err.message,
      stack: err.stack
    });
  }
}
