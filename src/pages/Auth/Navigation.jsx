import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AiOutlineDashboard,
  AiOutlineInbox,
  AiOutlineUnorderedList,
  AiOutlineShop,
  AiOutlineTeam,
  AiOutlineLogout,
  AiOutlineTag
} from "react-icons/ai";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import UserIcon from "../../assets/user";
import HeartIcon from "../../assets/heart";
import HomeIcon from "../../assets/home";
import HelpIcon from "../../assets/help";
import Profile from "../../pages/User/Profile";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const expandedAreaRef = useRef(null);

  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const toggleProfileExpanded = () => {
    if (userInfo) {
      if (!userInfo.isAdmin) {
        setIsProfileExpanded(prevState => !prevState);
        setDropdownOpen(false);
      } else {
        setDropdownOpen(prevState => !prevState);
      }
      setActiveItem("/profile");
    } else {
      navigate("/login");
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false);
      setIsProfileExpanded(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedAreaRef.current && !expandedAreaRef.current.contains(event.target) &&
          profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
        setIsProfileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { 
      to: `https://wa.me/916306500300`, 
      icon: HelpIcon, 
      label: "Help",
      onClick: (e) => {
        e.preventDefault();
        window.open(`https://wa.me/916306500300`, '_blank');
      }
    },
    { to: "/favorite", icon: HeartIcon, label: "Favorites" },
  ];

  const dropdownItems = userInfo?.isAdmin
    ? [
        { to: "/admin/dashboard", icon: AiOutlineDashboard, label: "Dashboard" },
        { to: "/admin/productlist", icon: AiOutlineInbox, label: "Products" },
        { to: "/admin/categorylist", icon: AiOutlineUnorderedList, label: "Categories" },
        { to: "/admin/subcategorylist", icon: AiOutlineUnorderedList, label: "Subcategories" },
        { to: "/admin/couponlist", icon: AiOutlineTag, label: "Coupons" },
        { to: "/admin/orderlist", icon: AiOutlineShop, label: "Orders" },
        { to: "/admin/userlist", icon: AiOutlineTeam, label: "Users" },
        { onClick: logoutHandler, icon: AiOutlineLogout, label: "Logout" },
      ]
    : [];

  const NavItem = ({ to, icon: Icon, label, onClick }) => {
    const isActive = activeItem === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center px-4 py-2 text-black hover:text-yellow-700 transition-colors duration-300 ${
          isActive ? 'text-black' : ''
        }`}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }
          setActiveItem(to);
        }}
      >
        <Icon className={`text-2xl mb-1 ${isActive ? 'fill-[#facc15]' : ''}`} />
        <span className="text-xs">{label}</span>
        {label === "Cart" && cartItems.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartItems.reduce((a, c) => a + c.qty, 0)}
          </span>
        )}
        {label === "Favorites" && <FavoritesCount />}
      </Link>
    );
  };

  const DropdownItem = ({ to, onClick, icon: Icon, label }) => {
    const content = (
      <div className="flex items-center justify-start w-full py-3 px-4 hover:bg-yellow-100 transition-colors duration-300">
        <Icon className="text-xl mr-3 text-yellow-700" />
        <span className="text-sm text-yellow-900">{label}</span>
      </div>
    );

    if (to) {
      return (
        <Link to={to} onClick={() => setDropdownOpen(false)} className="w-full">
          {content}
        </Link>
      );
    }

    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {!userInfo?.isAdmin && userInfo && (
        <div 
        ref={expandedAreaRef}
        className={`fixed inset-x-0 bottom-14 overflow-y-auto transition-all duration-500 ease-in-out 
                    backdrop-blur-lg bg-[#f8f0e0c9]
                    ${isProfileExpanded ? 'h-[calc(100vh-9rem)] opacity-100' : 'h-0 opacity-0'}`}
        style={{
          boxShadow: isProfileExpanded ? '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
        }}
      >
          <div className="w-16 h-1 bg-gray-900  mx-auto mt-3 rounded-full"></div>
          <div className={`${isProfileExpanded ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-500 ease-in-out`}>
            <Profile onClose={() => setIsProfileExpanded(false)} />
            <div className="mt-6 pt-6 border-t border-gray-200 px-6 pb-6">
              <button
                onClick={logoutHandler}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-yellow-200 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {userInfo?.isAdmin && (
        <div 
          ref={dropdownRef}
          className={`bg-white rounded-t-3xl shadow-lg transition-all pb-9 mb-9 duration-300 ease-in-out overflow-hidden ${
            dropdownOpen ? 'max-h-[calc(100vh-5rem)]' : 'max-h-0'
          }`}
        >
          <div className="py-2 flex flex-col text-black">
            {dropdownItems.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#f8dd63] backdrop-blur-md to-white shadow-lg rounded-t-xl border-t-1 border-yellow-400">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center py-2">
      {navItems.map((item) => (
        <NavItem key={item.to} {...item} isActive={activeItem === item.to} />
      ))}
      <div className="relative">
        <button
          ref={profileButtonRef}
          onClick={toggleProfileExpanded}
          className={`flex flex-col items-center justify-center px-4 py-2 text-gray-800 hover:text-yellow-700 transition-colors duration-300 ${
            activeItem === "/profile" ? 'text-yellow-700' : ''
          }`}
        >
          <UserIcon className={`mb-1 ${activeItem === "/profile" ? 'text-yellow-700' : ''}`} size={24} />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  </div>
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
</nav>

    </div>
  );
};

export default Navigation;