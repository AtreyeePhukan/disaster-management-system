import React, { useState } from 'react';
import { Lock, Mail, ChevronUp } from 'lucide-react';

export default function DonationFormPage() {

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    amount: 50,
    customAmount: '',
    donationType: 'one-time',
    monthlyRecurring: false,
    fullName: '',
    email: '',
    phone: '',
    selectedDisaster: 'wildfire',
    specificNeeds: false,
    fundType: 'general',
    donorEmail: '',
    expirationFund: '',
    category: 'food',
    paymentMethod: 'mastercard',
    sameAsPersonal: false,
    cvv: '',
    billingAddress: '',
    receiveUpdates: true,
    donateAnonymously: false,
    dedicateAnonymously: false,
    reasonForDonation: "general",
    allocationType: "general",
  });

  const predefinedAmounts = [25, 50, 100, 100, 250];
  
  const handleAmountClick = (amount) => {
    setFormData(prev => ({ ...prev, amount, customAmount: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_BASE}/submitDonation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

    const data = await response.json();

    if (response.ok) {
      alert("Donation submitted successfully!");
      console.log("Donation ID:", data.donationId);
    } else {
      alert("Failed to submit donation. Check console for details.");
      console.error(data);
    }
  } catch (error) {
    console.error("Error submitting donation:", error);
    alert("Something went wrong. Please try again later.");
  }
};


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-900 rounded-lg border border-gray-800 p-8 relative">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-red-600 pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-red-600 pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-red-600 pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-red-600 pointer-events-none"></div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">Disaster Relief Donation</h1>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Lock className="w-4 h-4 text-red-600" />
          <span className="text-sm text-gray-400">Secure Transaction</span>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

        {/* Donation Amount */}
        <div className="mb-6">
  <h2 className="text-white font-semibold mb-4">Donation Amount</h2>

  {/* Amount Buttons */}
  <div className="flex space-x-3 mb-4">
    {predefinedAmounts.map((amt, index) => (
      <button
        key={index}
        onClick={() => handleAmountClick(amt)}
        className={`px-6 py-2 rounded-full transition-all ${
  formData.amount === amt ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
}`}
      >
        ₹{amt}
      </button>
    ))}

    <button
      onClick={() =>
        setFormData(prev => ({ ...prev, amount: '', customAmount: '' }))
      }
      className={`px-6 py-2 rounded-full transition-all ${
        formData.amount === '' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      ₹ Other Amount
    </button>
  </div>

  {/* Custom Amount Input — MOVED OUTSIDE THE FLEX ROW */}
  {formData.amount === '' && (
    <input
      type="number"
      name="customAmount"
      placeholder="Enter Amount"
      value={formData.customAmount}
      onChange={handleInputChange}
      className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-red-600 mb-4"
    />
  )}

  {/* Donation Type / Recurring */}
  <div className="flex items-center space-x-6 text-sm">
    <label className="flex items-center space-x-2 text-gray-300">
      <input
        type="radio"
        name="donationType"
        value="one-time"
        checked={formData.donationType === 'one-time'}
        onChange={handleInputChange}
        className="text-red-600"
      />
      <span>One-time donation</span>
    </label>

    <label className="flex items-center space-x-2 text-gray-300">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${formData.monthlyRecurring ? 'bg-red-600' : 'bg-gray-600'}`}></div>
      </div>
      <span>One-time recurring donation</span>
    </label>

    <label className="flex items-center space-x-2 text-gray-300">
      <span>Monthly recurring donation</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="monthlyRecurring"
          checked={formData.monthlyRecurring}
          onChange={handleInputChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
      </label>
    </label>
  </div>
</div>


        {/* Donation Allocation */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Donation Allocation</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            
            <div className="relative">
              <select
                name="selectedDisaster"
                value={formData.selectedDisaster}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
              >
                <option value="">Select disaster area</option>
                <option value="typhoon">General Relief funds</option>
                <option value="wildfire">Fire Relief</option>
                <option value="flood">Flood Relief</option>
                <option value="earthquake">Earthquake Response</option>
              </select>
              <ChevronUp className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-red-600" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Reason for donation</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, reasonForDonation: "general" }))}
            className={`bg-gray-800 text-gray-300 px-4 py-2 rounded text-sm ${
  formData.reasonForDonation === "general" ? "border border-red-600" : ""
}`}

          >
  General funds
</button>

<button
  onClick={() => setFormData(prev => ({ ...prev, reasonForDonation: "food" }))}
  className={`bg-gray-800 text-gray-300 px-4 py-2 rounded text-sm ${
    formData.reasonForDonation === "food" ? "border border-red-600" : ""
  }`}
>
  Food
</button>

<button
  onClick={() => setFormData(prev => ({ ...prev, reasonForDonation: "medical" }))}
  className={`bg-gray-800 text-gray-300 px-4 py-2 rounded text-sm ${
    formData.reasonForDonation === "medical" ? "border border-red-600" : ""
  }`}
>
  Medical
</button>

          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Payment Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded border border-gray-700">
              <div className="flex space-x-2">
                <div className="w-8 h-6 bg-red-600 rounded"></div>
                <div className="w-8 h-6 bg-red-600 rounded"></div>
              </div>
              <span className="text-gray-400 text-sm">Mastercard</span>
              <div className="w-8 h-6 bg-gray-700 rounded"></div>
            </div>
            
            <label className="flex items-center space-x-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                name="sameAsPersonal"
                checked={formData.sameAsPersonal}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Same as personal (Optional)</span>
            </label>

            <input
              type="text"
              placeholder="Card Expiration Date"
              className="col-span-2 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleInputChange}
              maxLength="3"
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-red-600"
            />

            <input
              type="text"
              name="billingAddress"
              placeholder="Billing Address"
              value={formData.billingAddress}
              onChange={handleInputChange}
              className="col-span-2 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            
            
          </div>
        </div>

        {/* Additional Options */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Additional Options</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="receiveUpdates"
                checked={formData.receiveUpdates}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 border-red-600 rounded"
              />
              <span className="text-gray-300 text-sm">Receive updates...</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="donateAnonymously"
                checked={formData.donateAnonymously}
                onChange={handleInputChange}
                className="w-4 h-4 border-gray-600 rounded"
              />
              <span className="text-gray-300 text-sm">Donate anonymously</span>
            </label>

            <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    name="dedicateAnonymously"
    checked={formData.dedicateAnonymously}
    onChange={handleInputChange}
    className="sr-only peer"
  />
  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
</label>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

        {/* Submit Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-16 py-3 rounded transition-all"
          >
            Complete Donation
          </button>

          <p className="text-gray-400 text-xs flex items-center space-x-2">
            <span>Your donation will help provide:</span>
            <span className="text-red-600">🍽️ 🏠 💧</span>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-2 w-3 h-3 border-l-2 border-red-600 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-2 w-3 h-3 border-r-2 border-red-600 pointer-events-none"></div>
        <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full border border-red-600 pointer-events-none"></div>
      </div>
    </div>
  );
}