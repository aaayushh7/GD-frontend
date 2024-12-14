import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartButton from "./components/CartButton";
import SplashScreen from "./SplashScreen";

const App = () => {
  const [showContent, setShowContent] = React.useState(false);

  // This effect will run after splash screen is done
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // Match this with your splash screen duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen />
      
      {/* Only render the main content after splash screen is done */}
      {showContent && (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
            toastClassName={({ type }) =>
              `${
                type === 'success' ? 'border-green-500' :
                type === 'error' ? 'border-red-500' :
                type === 'info' ? 'border-blue-500' :
                'border-yellow-500'
              } relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer border-l-4 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 shadow-md`
            }
            bodyClassName="text-sm font-medium text-gray-700 p-3 flex items-center"
            closeButton={({ closeToast }) => (
              <button onClick={closeToast} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            icon={({ type }) => {
              switch (type) {
                case 'success':
                  return <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
                case 'error':
                  return <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
                case 'info':
                  return <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                default:
                  return <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
              }
            }}
          />
          <Navigation />
          <main className="min-h-screen bg-amber-50">
            <Outlet />
            <CartButton />
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default App;