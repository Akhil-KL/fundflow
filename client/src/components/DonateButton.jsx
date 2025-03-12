import React from 'react';

const DonateButton = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // TODO: Replace this with a real API call to your server
    const order = await fetch('http://localhost:5000/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500 }) // 500 = ₹5.00
    }).then(res => res.json());

    const options = {
      key: "rzp_test_1234567890abcdef", // ⚠️ Replace later with actual public key
      currency: order.currency,
      amount: order.amount,
      order_id: order.id,
      name: "FundFlow",
      description: "Donation for a cause",
      handler: function (response) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Akhil Kumar",
        email: "akhil@example.com",
        contact: "9999999999",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      onClick={handleDonate}
      className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-all"
    >
      Donate ₹5
    </button>
  );
};

export default DonateButton;
