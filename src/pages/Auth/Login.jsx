import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGoogleSignUpMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronLeft } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from "../../assets/googleLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [googleSignUp, { isLoading: isGoogleSignUpLoading }] = useGoogleSignUpMutation();

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
    setLoginError("");
    setIsSubmitting(true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    try {
      const loginPromise = login({ email, password }).unwrap();
      const res = await Promise.race([loginPromise, timeoutPromise]);
      
      if (res.error) {
        throw new Error(res.error);
      }
      
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      let errorMessage;
      if (err.message === "Request timed out") {
        errorMessage = "Login request timed out. Please try again.";
      } else if (err.status === 401) {
        errorMessage = "Invalid email or password.";
      } else {
        errorMessage = err.data?.message || err.message || "An error occurred. Please try again.";
      }
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="flex-1 text-center text-2xl text-[#222]">Log In</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="px-6 pt-9">
      <h3 className="flex-1 text-md  text-gray-500 mb-2">Email</h3>
        <form onSubmit={submitHandler} className="space-y-6">
        
          {/* Email Input */}
          <div>
            <input
              type="email"
              id="email"
              className="w-full h-[45px] px-4 rounded-xl border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
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
              className="w-full h-[45px] px-4 rounded-xl border-[1px] border-[#afd1b2] bg-[#FFF6E3] text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#DAF5DC] focus:ring-1 focus:ring-[#DAF5DC]"
              placeholder="Text your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div 
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  rememberMe ? 'bg-[#FFB84D] border-[#FFB84D]' : 'border-gray-300'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm text-center">{loginError}</div>
          )}

          {/* Login Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full mx-auto h-[40px] bg-[#f97f34] text-white font-bold rounded-[10px] flex items-center justify-center"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Log In"
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
            className="w-full mx-auto h-[40px] bg-[#FFF6E3] border border-gray-300 text-[#222] rounded-[10px] flex items-center justify-center space-x-2"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-[16px] text-gray-500 hover:underline"
            >
              Don't have an account? <span className="text-green-600">Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;