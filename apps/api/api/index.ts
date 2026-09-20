export default async function (req: any, res: any) {
  const mod = require('../dist/main');
  const handler = mod.default || mod;
  return await handler(req, res);
}
