import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import { useGetUserAddressQuery,
  useUpdateAddressMutation, useSaveAddressMutation } from '../../redux/api/addressApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import Loader from '../../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: userAddress, isLoading: loadingAddress, refetch: refetchAddress } = useGetUserAddressQuery();
  const [updateAddress, { isLoading: loadingUpdateAddress }] = useUpdateAddressMutation();
  const [addAddress, { isLoading: loadingAddAddress }] = useSaveAddressMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userAddress) {
      setEditedAddress({
        address: userAddress.address,
        city: userAddress.city,
        postalCode: userAddress.postalCode,
        country: userAddress.country,
      });
    }
  }, [userAddress]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isChangingPassword && password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          ...(isChangingPassword && { password }),
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
        setIsEditingName(false);
        setIsChangingPassword(false);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (userAddress) {
        await updateAddress({ id: userAddress._id, ...editedAddress }).unwrap();
      } else {
        await addAddress(editedAddress).unwrap();
      }
      toast.success('Address updated successfully');
      setIsEditingAddress(false);
      refetchAddress();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleShowAddress = async () => {
    if (!showAddress) {
      setIsLoadingAddress(true);
      try {
        await refetchAddress();
      } catch (error) {
        toast.error('Failed to fetch address. Please try again.');
      } finally {
        setIsLoadingAddress(false);
      }
    }
    setShowAddress(!showAddress);
  };

  const handleNavigateToUserOrder = () => {
    navigate('/user-order');
  };

  const faqItems = [
    {
      question: "How fast can I expect my delivery?",
      answer: "We aim to deliver all orders within 20 minutes of placement. However, exact delivery times may vary based on your location and current demand."
    },
    {
      question: "What types of items can I order?",
      answer: "You can order a wide range of items including food from local restaurants, groceries, and other essential items."
    },
    {
      question: "Is there a minimum order value?",
      answer: "The minimum order value may vary depending on the merchant and your location. You'll see the minimum order value, if any, when you place your order."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you can track its status in real-time through our app. You'll receive notifications at key stages of the delivery process."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "We strive for 100% customer satisfaction. If you're not happy with your order, please contact our customer support team within 24 hours of delivery, and we'll do our best to resolve the issue."
    }
  ];

  return (
    <div className="p-6 bg-transparent h-full overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-yellow-700 hover:text-yellow-900 transition-colors duration-300 font-bold"
      >
        Done
      </button>
      <h2 className="text-2xl font-semibold text-yellow-800 mb-6 mt-3">Your Profile</h2>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="flex items-center">
          <label className="block text-yellow-800 font-medium mb-2 mr-2" htmlFor="username">Name</label>
          {isEditingName ? (
            <input
              type="text"
              id="username"
              placeholder="Enter name"
              className="flex-grow px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white bg-opacity-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <span className="flex-grow text-yellow-800">{username}</span>
          )}
          <button
            type="button"
            onClick={() => setIsEditingName(!isEditingName)}
            className="ml-2 px-3 py-1 bg-yellow-500 text-gray-800 rounded-md hover:bg-yellow-700 transition duration-300"
          >
            {isEditingName ? 'Save' : 'Edit'}
          </button>
        </div>

        <div>
          <label className="block text-yellow-800 font-medium mb-2" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-yellow-400 rounded-md bg-white bg-opacity-50 text-gray-500"
            value={email}
            disabled
          />
        </div>

        <motion.div
          initial={false}
          animate={{ height: isChangingPassword ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {isChangingPassword && (
            <>
              <div>
                <label className="block text-yellow-800 font-medium mb-2" htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white bg-opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label className="block text-yellow-800 font-medium mb-2" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white bg-opacity-50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md mt-4"
              >
                Update Profile
              </button>
            </>
          )}
        </motion.div>

        <button
          type="button"
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md"
        >
          {isChangingPassword ? 'Cancel' : 'Change Password'}
        </button>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleShowAddress}
          disabled={isLoadingAddress}
          className={`w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md relative ${
            isLoadingAddress ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoadingAddress ? (
            <>
              <span className="opacity-0">My Address</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            'My Address'
          )}
        </button>
        <AnimatePresence>
          {showAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-white bg-opacity-50 rounded-md overflow-hidden"
            >
              {userAddress ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-yellow-800">Saved Address</h3>
                    <button
                      onClick={handleEditAddress}
                      className="px-3 py-1 bg-yellow-500 text-gray-800 rounded-md hover:bg-yellow-700 transition duration-300"
                    >
                      Edit
                    </button>
                  </div>
                  {isEditingAddress ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedAddress.address}
                        onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Flat/Room No."
                      />
                      <input
                        type="text"
                        value={editedAddress.city}
                        onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Address Line 2"
                      />
                      <input
                        type="text"
                        value={editedAddress.postalCode}
                        onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Postal Code"
                      />
                      <input
                        type="text"
                        value={editedAddress.country}
                        onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Contact No."
                      />
                      <button
                        onClick={handleSaveAddress}
                        className="w-full bg-yellow-500 text-gray-800 py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300"
                      >
                        Save Address
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-yellow-800">{userAddress.address}</p>
                      <p className="text-yellow-800">{userAddress.city}, {userAddress.postalCode}</p>
                      <p className="text-yellow-800">{userAddress.country}</p>
                      {userAddress.extraCharge > 0 && (
                        <p className="text-yellow-600 mt-2">Extra Charge: ₹{userAddress.extraCharge}</p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-yellow-800 mb-4">No address found.</p>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="px-4 py-2 bg-yellow-500 text-gray-800 rounded-md hover:bg-yellow-700 transition duration-300"
                  >
                    Add Address
                  </button>
                  {isEditingAddress && (
                    <div className="space-y-2 mt-4">
                      <input
                        type="text"
                        value={editedAddress.address}
                        onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Address"
                      />
                      <input
                        type="text"
                        value={editedAddress.city}
                        onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Address line 2 "
                      />
                      <input
                        type="text"
                        value={editedAddress.postalCode}
                        onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Postal Code"
                      />
                    
                      <input
                        type="text"
                        value={editedAddress.country}
                        onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-400 rounded-md"
                        placeholder="Phone Number"
                      />
                      <button
                        onClick={handleSaveAddress}
                        className="w-full bg-yellow-500 text-gray-800 py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300"
                      >
                        Save Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleNavigateToUserOrder}
          className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md"
        >
          My Orders
        </button>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowFAQ(!showFAQ)}
          className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md"
        >
          FAQs
        </button>
        <AnimatePresence>
          {showFAQ && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white bg-opacity-50 p-4 rounded-md">
                  <h4 className="font-semibold text-yellow-800 mb-2">{item.question}</h4>
                  <p className="text-yellow-700">{item.answer}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(loadingUpdateProfile || loadingAddress || loadingUpdateAddress || loadingAddAddress) && <Loader />}
    </div>
  );
};

export default Profile;