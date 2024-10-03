const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>
      
      <div className="relative bg-amber-50 rounded-lg shadow-xl max-w-lg w-full m-3 z-10">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            className="text-amber-800 hover:text-amber-600 transition-colors duration-200 focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;