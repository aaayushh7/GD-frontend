import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGoogleSignUpMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PizzaIcon, LockIcon, MailIcon } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';
import  GoogleIcon from "../../assets/googleLogo"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        console.log("Google User Info:", userInfo); // Debugging log

        const res = await googleSignUp({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name
        }).unwrap();

        console.log("Google Sign Up Response:", res); // Debugging log

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        <div className="flex justify-center mb-6">
          <PizzaIcon size={48} className="text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <MailIcon className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                className="pl-10 w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                className="pl-10 w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="mb-4 text-red-500 text-sm text-center">{loginError}</div>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transform hover:-translate-y-1 active:translate-y-0"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
              />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignUp}
            disabled={isGoogleSignUpLoading}
            className="w-full bg-white text-gray-700 gap-2 font-bold py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <GoogleIcon/>
            {isGoogleSignUpLoading ? "Loading..." : "Sign in with Google"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New to our app?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-yellow-500 hover:underline font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
