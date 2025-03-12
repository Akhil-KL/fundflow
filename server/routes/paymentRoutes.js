import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { useState } from "react";
import axios from "axios";

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 📦 Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// ✅ Verify payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    // ✅ Save donation or mark campaign as funded etc.
    res.json({ status: "Payment verified successfully" });
  } else {
    res.status(400).json({ status: "Invalid signature" });
  }
});

//donation form
const DonationForm = () => {
  const [amount, setAmount] = useState("");

  const handleDonate = async (e) => {
    e.preventDefault();

    try {
      const { data: order } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: Number(amount),
      });

      const options = {
        key: "RAZORPAY_KEY_ID", // 🔁 Replace with actual key later
        amount: order.amount,
        currency: order.currency,
        name: "FundFlow",
        description: "Donation",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", response);
          alert(verifyRes.data.status);
        },
        prefill: {
          name: "Akhil",
          email: "akhil@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleDonate} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-2xl font-bold">Make a Donation</h2>
      <input
        type="number"
        placeholder="Enter amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md"
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Donate
      </button>
    </form>
  );
};

export default DonationForm;


export default router;
