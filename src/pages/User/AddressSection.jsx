import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import {
    useSaveAddressMutation,
    useGetUserAddressesQuery,
    useUpdateAddressMutation,
    useSetDefaultAddressMutation // Add this import
} from "../../redux/api/addressApiSlice";
import {
    savePaymentMethod,
    saveShippingAddress
} from "../../redux/features/cart/cartSlice";

const AddressSection = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);

    const [showForm, setShowForm] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const { 
        data: userAddresses, 
        isLoading: loadingAddress, 
        refetch: refetchAddress 
    } = useGetUserAddressesQuery();

    const [updateAddress, { isLoading: loadingUpdateAddress }] = useUpdateAddressMutation();
    const [addAddress, { isLoading: loadingAddAddress }] = useSaveAddressMutation();
    const [setDefaultAddress] = useSetDefaultAddressMutation(); // Add this line


    // Determine the address to display (default or first address)
    const displayAddress = userAddresses?.length > 0 
        ? (
            // Prioritize the default address
            userAddresses.find(addr => addr.isDefault) || 
            // If no default, use the first address
            userAddresses[0]
        )
        : null;

    useEffect(() => {
        if (displayAddress) {
            setAddress({
                address: displayAddress.address,
                postalCode: displayAddress.postalCode,
                country: displayAddress.country,
                city: displayAddress.city,
            });
        }
    }, [displayAddress]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleEditAddress = () => {
        setIsEditingAddress(true);
        setShowForm(true);
    };

    const handleSaveAddress = async (e) => {
      e.preventDefault();
      try {
          let savedAddress;
          if (displayAddress) {
              savedAddress = await updateAddress({ 
                  id: displayAddress._id, 
                  ...address 
              }).unwrap();

              // If the updated address is not the default, set it as default
              if (!savedAddress.isDefault) {
                  await setDefaultAddress(savedAddress._id).unwrap();
              }
          } else {
              savedAddress = await addAddress(address).unwrap();
          }

          dispatch(saveShippingAddress({
              fullName: userInfo?.name || '', 
              address: savedAddress.address,
              city: savedAddress.city,
              postalCode: savedAddress.postalCode,
              country: savedAddress.country,
              email: userInfo?.email || '',
              phone: savedAddress.phone || ''
          }));

          toast.success('Address updated successfully');
          setIsEditingAddress(false);
          setShowForm(false);
          refetchAddress();
      } catch (err) {
          toast.error(err?.data?.message || err.error);
      }
  };

    const handleShowAddress = async () => {
        if (!showForm) {
            setIsLoadingAddress(true);
            try {
                await refetchAddress();
            } catch (error) {
                toast.error('Failed to fetch address. Please try again.');
            } finally {
                setIsLoadingAddress(false);
            }
        }
        setShowForm(!showForm);
    };

    const handleSetDefaultAddress = async (addressId) => {
      try {
          await setDefaultAddress(addressId).unwrap();
          refetchAddress();
          toast.success('Default address updated');
      } catch (err) {
          toast.error(err?.data?.message || 'Failed to set default address');
      }
  };


    return (
        <div className="fixed bottom-[4.85rem] left-0 right-0 z-50">
            {/* Bottom Bar */}
            <div 
                className={`
                    bg-gradient-to-r from-orange-100 to-white 
                    p-4 flex rounded-t-2xl items-center justify-between 
                    shadow-lg cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${showForm ? 'rounded-b-none' : ''}
                `}
                onClick={!showForm && !displayAddress ? handleShowAddress : undefined}
            >
                <div className="w-[240px]">
                    <p className="text-[12px] text-green-700 font-medium">
                        {displayAddress ? 'Delivering to:' : 'Add Address'}
                    </p>
                    {displayAddress && (
                        <p className="text-xs text-gray-700">
                            {`${displayAddress.address}, ${displayAddress.city}, ${displayAddress.postalCode}, ${displayAddress.country}`}
                        </p>
                    )}
                </div>
                
                {displayAddress && !showForm && (
                    <button 
                        onClick={handleEditAddress}
                        className="text-orange-600 font-medium text-xs ml-2"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Expandable Form */}
            <div 
                className={`
                    bg-white 
                    shadow-2xl 
                    overflow-hidden 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    ${showForm 
                        ? 'max-h-[500px] opacity-100 py-4 px-4' 
                        : 'max-h-0 opacity-0 py-0 px-0'}
                `}
            >
                {showForm && (
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                        <input
                            type="text"
                            name="address"
                            placeholder="Address Line 1"
                            value={address.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={address.city}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Postal Code"
                            value={address.postalCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={address.country}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loadingUpdateAddress || loadingAddAddress}
                                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                            >
                                {loadingUpdateAddress 
                                    ? 'Updating...' 
                                    : loadingAddAddress 
                                    ? 'Saving...' 
                                    : isEditingAddress 
                                    ? 'Update Address' 
                                    : 'Save Address'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setIsEditingAddress(false);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded text-red-500 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


  const PaymentMethodSection = ({ onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const paymentMethods = ["Pay on delivery", "PayPal"];
    const dispatch = useDispatch();

    // Load previously selected method from localStorage on component mount
    useEffect(() => {
        const savedMethod = localStorage.getItem('selectedPaymentMethod');
        // Default to "Pay on delivery" if no method was previously saved
        setSelectedMethod(savedMethod || "Pay on delivery");
    }, []);

    const handlePaymentMethodChange = (method) => {
        // Set the selected method
        setSelectedMethod(method);
        
        // Save to localStorage for persistence
        localStorage.setItem('selectedPaymentMethod', method);
        
        // Dispatch the payment method
        dispatch(savePaymentMethod(method));

        // Show success toast
        toast.success(`Payment method changed to ${method}`);

        // Close the payment component
        if (onClose) {
            onClose();
        }
    };

    return (
        <div 
            className="mt-4 p-4 rounded-lg text-black"
            style={{
                background: 'linear-gradient(to right, #FFEDD5, white)', // Orange to white gradient
            }}
        >
            <div className="flex items-center gap-2 mb-4 text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                <span className="font-medium">Payment Method</span>
            </div>

            <div className="space-y-2">
                {paymentMethods.map((method) => (
                    <button
                        key={method}
                        onClick={() => handlePaymentMethodChange(method)}
                        className={`w-full p-3 text-left rounded border ${
                            selectedMethod === method
                                ? 'text-white bg-orange-500'
                                : 'hover:border-green-500 border-gray-500'
                        } transition-colors duration-200`}
                    >
                        <div className="flex items-center justify-between">
                            <span>{method}</span>
                            {selectedMethod === method && (
                                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export { AddressSection, PaymentMethodSection };