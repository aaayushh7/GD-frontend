import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Edit, Lock, Phone, HelpCircle, LogOut, X} from 'lucide-react';

const ProfileRedesign = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isChangingPassword && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

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
  };

  const faqItems = [
    {
      question: "How fast can I expect my delivery?",
      answer: "We aim to deliver all orders within 20 minutes of placement."
    },
    {
      question: "What types of items can I order?",
      answer: "You can order food from local restaurants, groceries, and other essential items."
    },
    {
      question: "Is there a minimum order value?",
      answer: "Minimum order value varies depending on the merchant and location."
    }
  ];


  const handleContactSupport = () => {
    window.location.href = 'mailto:aayushtiwari071@gmail.com';
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 flex flex-col">
      {/* Close Button */}
      

      {/* User Profile Section */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-xl text-gray-600 text-center mb-6">{username}</h2>

      {/* Profile Details Box */}
      <div className="border-[1px] border-green-600 rounded-lg p-6 mb-4">
        <h3 className="text-md  text-gray-800 mb-4">Profile Details</h3>
        
        {/* Name Section */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center">
            <h3 className='text-sm text-gray-500 '>Name :</h3>
            {isEditingName ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-green-300 rounded-md p-2 w-full"
              />
            ) : (
              <span className='pl-2 text-sm'>{username}</span>
            )}
          </div>
          <button 
            onClick={() => setIsEditingName(!isEditingName)}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            {isEditingName ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Email Section */}
        <div className="flex items-center mb-4 pb-4 border-b">
        <h3 className='text-sm text-gray-500 '>Email :</h3>

          <span className='pl-2 text-sm'>{email}</span>
        </div>

        {/* Change Password Section */}
        <div>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            <div className="flex items-center">
              <span className='text-sm text-gray-500'>Change Password</span>
            </div>
            <span className={`transform text-xs text-gray-500 ${isChangingPassword ? 'rotate-180' : ''} transition-transform`}>
              ▼
            </span>
          </div>

          <AnimatePresence>
            {isChangingPassword && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={submitHandler}
                className="mt-4 space-y-4 border-t border-green-300 pt-4"
              >
                <input 
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input 
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex space-x-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAQs and Help Box */}
      <div className="bg-white border-[1px] border-green-600 rounded-lg p-6 mb-4">
        <h3 className="text-md text-gray-800 mb-4">Help & Support</h3>
        
        <div className="space-y-4">
          {/* FAQs Section */}
          <div>
            <button 
              onClick={() => setShowFAQ(!showFAQ)}
              className="w-full flex items-center justify-between p-3 rounded-md "
            >
              <div className="flex items-center">
                <HelpCircle className="text-xs mr-2 text-gray-600" />
                <span className='text-gray-500 text-sm'>Frequently Asked Questions</span>
              </div>
              <span className={`transform text-xs text-gray-500 ${showFAQ ? 'rotate-180' : ''} transition-transform`}>
                ▼
              </span>
            </button>

            {showFAQ && (
              <div className="mt-2 space-y-2 p-4 ">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-2">
                    <h4 className="font-semibold text-gray-800">{item.question}</h4>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Need Help Section */}
          <button 
            onClick={handleContactSupport}
            className="w-full flex items-center justify-between p-3 rounded-md "
          >
            <div className="flex items-center">
              <Phone className="mr-2 text-gray-600" />
              <span className='text-sm text-gray-500'>Need Help? Contact Support</span>
            </div>
          </button>
        </div>
      </div>
     
    </div>
  );
};

export default ProfileRedesign;