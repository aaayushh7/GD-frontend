import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation, useGoogleSignUpMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from "../../assets/googleLogo";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [googleSignUp, { isLoading: isGoogleSignUpLoading }] = useGoogleSignUpMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info from Google');
        }

        const userInfo = await userInfoResponse.json();
        const res = await googleSignUp({ 
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered with Google");
      } catch (err) {
        console.error('Google Sign Up Error:', err);
        toast.error(err?.data?.message || "An error occurred during Google Sign Up");
      }
    },
    onError: (error) => {
      console.error('Google Sign Up Error:', error);
      toast.error("Google Sign Up failed");
    },
  });

  return (
    <div className="min-h-screen bg-[#FFF6E3]">
      {/* Navigation Bar */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-[#222]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#222]">Register</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="px-6 pt-8">
        <form onSubmit={submitHandler} className="space-y-6">

          {/* Name Input */}
          <div>
          <h3 className="flex-1 text-md  text-gray-500 mb-2">Name</h3>

            <input
              type="text"
              id="name"
              className="w-full h-[40px] px-4 rounded-lg border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
              placeholder="Text your name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
          <h3 className="flex-1 text-md  text-gray-500 mb-2">Email</h3>

            <input
              type="email"
              id="email"
              className="w-full h-[40px] px-4 rounded-lg border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
              placeholder="Text your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
          <h3 className="flex-1 text-md  text-gray-500 mb-2">Password</h3>

            <input
              type="password"
              id="password"
              className="w-full h-[40px] px-4 rounded-lg border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
              placeholder="Text your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
          <h3 className="flex-1 text-md  text-gray-500 mb-2">Confirm Password</h3>

            <input
              type="password"
              id="confirmPassword"
              className="w-full h-[40px] px-4 rounded-lg border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full mx-auto h-[40px] bg-[#f97f34] text-white font-bold rounded-[10px] flex items-center justify-center"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Register"
            )}
          </button>

          {/* Or Separator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-[#E5E5E5]"></div>
            <span className="text-sm font-bold text-gray-500">Or</span>
            <div className="flex-1 h-px bg-[#E5E5E5]"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isGoogleSignUpLoading}
            className="w-full mx-auto h-[40px] bg-white border border-[#E5E5E5] text-[#222] rounded-[10px] flex items-center justify-center space-x-2"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-[15px] text-gray-500 hover:underline"
            >
              Already have an account? <span className="text-[#f97f34]">Log In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;