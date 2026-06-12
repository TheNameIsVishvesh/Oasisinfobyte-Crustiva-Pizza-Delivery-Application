import axios from 'axios';
import crypto from 'crypto';

const API_URL = 'http://localhost:5000';

async function testAll() {
  try {
    console.log('\n=========================================');
    console.log('🚦 STARTING CRUSTIVA AUTOMATED SYSTEM FLOW TEST');
    console.log('=========================================\n');

    // 1. Register a new user
    const testEmail = `tester_${Date.now()}@example.com`;
    console.log(`[STEP 1] Registering user: ${testEmail}...`);
    const regRes = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Automated Surfer',
      email: testEmail,
      password: 'testpassword123'
    });
    console.log('✅ Registration successful. Response:', regRes.data);

    // 2. Login the registered user
    console.log('\n[STEP 2] Logging in newly registered user...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: testEmail,
      password: 'testpassword123'
    });
    console.log('✅ Login successful.');
    const token = loginRes.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. Get Pizzas Catalog
    console.log('\n[STEP 3] Fetching pizza recipe catalog...');
    const pizzasRes = await axios.get(`${API_URL}/api/pizzas`);
    console.log(`✅ Retrieved catalog. Count: ${pizzasRes.data.data.length} pizzas.`);
    const firstPizza = pizzasRes.data.data[0];
    console.log(`First Pizza in list: "${firstPizza.name}" (Baseline price: ₹${firstPizza.price})`);

    // 4. Get Customization Options
    console.log('\n[STEP 4] Fetching dynamic customization options...');
    const optionsRes = await axios.get(`${API_URL}/api/pizzas/customizer-options`);
    const opts = optionsRes.data.data;
    console.log(`✅ Loaded options. Bases: ${opts.bases.length}, Sauces: ${opts.sauces.length}, Cheeses: ${opts.cheeses.length}, Veggies: ${opts.veggies.length}`);

    // 5. Create checkout order
    console.log('\n[STEP 5] Requesting Razorpay transaction order...');
    const checkoutItems = [
      {
        pizzaId: firstPizza._id,
        name: firstPizza.name,
        size: 'Large',
        quantity: 1,
        isCustomized: true,
        customization: {
          base: opts.bases[0].name,
          sauce: opts.sauces[0].name,
          cheese: opts.cheeses[0].name,
          veggies: [opts.veggies[0].name, opts.veggies[1].name],
          meat: []
        }
      }
    ];

    const orderPayload = {
      items: checkoutItems
    };

    const orderRes = await axios.post(`${API_URL}/api/payments/create-order`, orderPayload, authHeaders);
    console.log('✅ Razorpay order created. ID:', orderRes.data.data.order_id);
    const rpOrderId = orderRes.data.data.order_id;

    // 6. Verify Payment
    console.log('\n[STEP 6] Simulating payment completion and signature verification...');
    const rpPaymentId = `pay_mock_${Date.now()}`;
    const keySecret = 'FAfY9h3LXPWC7fGleSzuxup5';
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${rpOrderId}|${rpPaymentId}`);
    const rpSignature = hmac.digest('hex');

    const verifyPayload = {
      razorpay_order_id: rpOrderId,
      razorpay_payment_id: rpPaymentId,
      razorpay_signature: rpSignature,
      items: checkoutItems,
      deliveryAddress: '404 Sourdough Boulevard, Silicon Valley',
      deliveryPhone: '9876543210'
    };

    const verifyRes = await axios.post(`${API_URL}/api/payments/verify`, verifyPayload, authHeaders);
    console.log('✅ Payment verified and order saved. Order ID:', verifyRes.data.data._id);
    const savedOrderId = verifyRes.data.data._id;

    // 7. Retrieve my orders
    console.log('\n[STEP 7] Fetching customer order logs...');
    const historyRes = await axios.get(`${API_URL}/api/orders/my-orders`, authHeaders);
    console.log(`✅ Order history retrieved. Order count: ${historyRes.data.data.length}`);
    const lastOrder = historyRes.data.data[0];
    
    if (lastOrder._id === savedOrderId) {
      console.log('🎉 Verification match! The saved order matches the history log.');
    } else {
      throw new Error('Verification mismatch between checkout and history.');
    }

    console.log('\n=========================================');
    console.log('🎉 ALL AUTOMATED FLOW TESTS COMPLETED WITH 100% SUCCESS!');
    console.log('=========================================\n');
  } catch (err) {
    console.error('\n❌ AUTOMATED FLOW TEST FAILURE:', err.response?.data || err.message);
    process.exit(1);
  }
}

testAll();
