import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sykxiyt7GHDV0v',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'FAfY9h3LXPWC7fGleSzuxup5',
});

export default razorpay;
