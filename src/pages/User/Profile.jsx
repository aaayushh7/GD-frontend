import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import Loader from '../../components/Loader';

const Profile = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

        {!isChangingPassword && (
          <button
            type="button"
            onClick={() => setIsChangingPassword(true)}
            className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md"
          >
            Change Password
          </button>
        )}

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

            <div>
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
          </>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-500 text-gray-800 py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-300 shadow-md"
        >
          Update Profile
        </button>
      </form>
      {loadingUpdateProfile && <Loader />}
    </div>
  );
};

export default Profile;
