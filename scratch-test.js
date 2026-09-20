const http = require('http');

function post(path, data, cookie) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    if (cookie) {
      options.headers['Cookie'] = cookie;
    }
    const req = http.request(options, (res) => {
      let body = '';
      const setCookie = res.headers['set-cookie'];
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), setCookie });
        } catch {
          resolve({ status: res.statusCode, raw: body, setCookie });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function test() {
  console.log('Logging in...');
  const loginRes = await post('/auth/login', {
    email: 'admin@tudongnrott.com',
    password: 'AdminPassword2026@',
  });
  console.log('Login result:', loginRes.status, loginRes.data?.success);
  console.log('Set-Cookie:', loginRes.setCookie);
  const cookie = loginRes.setCookie ? loginRes.setCookie.map(c => c.split(';')[0]).join('; ') : '';


  console.log('\nTesting /payments/deposit/create...');
  const depositRes = await post('/payments/deposit/create', { amount: 50000 }, cookie);
  console.log('Deposit result:', depositRes.status, depositRes.data);

  console.log('\nTesting /orders create with VIETQR...');
  // Let's first get products to get a valid product and plan
  const getProducts = () => new Promise((resolve) => {
    http.get('http://localhost:4000/api/v1/products', (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
  });

  const productsRes = await getProducts();
  const product = productsRes.data?.[0];
  if (product && product.plans?.[0]) {
    console.log('Found product:', product.name, product._id);
    const orderRes = await post('/orders', {
      productId: product._id,
      planId: product.plans[0].planId,
      paymentMethod: 'VIETQR'
    }, cookie);
    console.log('Order create result:', orderRes.status, orderRes.data);

    if (orderRes.data?.data?._id) {
      const qrRes = await post(`/payments/create-qr/${orderRes.data.data._id}`, {}, cookie);
      console.log('Create QR result:', qrRes.status, qrRes.data);
    }
  }
}

test().catch(console.error);
