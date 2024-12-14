import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSaveAddressMutation } from "../../redux/api/addressApiSlice";
import { saveShippingAddress } from "../../redux/features/cart/cartSlice";
import { FaMapMarkerAlt } from 'react-icons/fa';

const Shipping = () => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [saveAddress, { isLoading }] = useSaveAddressMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveAddress(formData).unwrap();
      dispatch(saveShippingAddress(formData));
      navigate('/');
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 transition-all duration-300"
        >
          <div className="flex items-center mb-8">
            <FaMapMarkerAlt className="text-green-700 text-xl mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Add Address</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter address line 2"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 text-white py-3 px-4 rounded-md hover:bg-green-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Save Address</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Save Address'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;