import Razorpay from "razorpay";

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});


//*  for frontend razorpay integration--->   http://youtube.com/watch?v=iXts47UteKM