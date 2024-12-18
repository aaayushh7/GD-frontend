import React, { useState, useEffect, useRef } from 'react';
import { FaCircle, FaChevronDown, FaPlus, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { 
    useGetUserAddressesQuery, 
    useSetDefaultAddressMutation 
} from "../../redux/api/addressApiSlice";

const HeaderAddressModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const iconRef = useRef(null);
    const defaultAddressRef = useRef(null);
    const navigate = useNavigate();

    const {
        data: userAddresses = [],
        isLoading,
        refetch
    } = useGetUserAddressesQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const [setDefaultAddress] = useSetDefaultAddressMutation();

    // More robust default address selection
    const defaultAddress = userAddresses.length > 0 
        ? (userAddresses.find(addr => addr.isDefault) || userAddresses[0])
        : null;

    // Get other addresses (excluding default)
    const otherAddresses = userAddresses.filter(
        addr => addr.id !== defaultAddress?.id
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                iconRef.current &&
                defaultAddressRef.current &&
                !modalRef.current.contains(event.target) &&
                !iconRef.current.contains(event.target) &&
                !defaultAddressRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalRef, iconRef, defaultAddressRef]);

    const toggleModal = () => {
        if (!isOpen) {
            refetch();
        }
        setIsOpen(!isOpen);
    };

    const handleAddAddress = () => {
        navigate('/shipping');
    };

    const handleSelectAddress = async (addressId) => {
        try {
            // Set the selected address as default
            await setDefaultAddress(addressId).unwrap();
            
            // Close the modal after successful selection
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to set default address', error);
        }
    };

    // Loading Animation Component
    const LoadingAnimation = () => (
        <div className="flex justify-center items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-green-700 rounded-full"></div>
            <div className="w-2 h-2 bg-green-700 rounded-full"></div>
            <div className="w-2 h-2 bg-green-700 rounded-full"></div>
        </div>
    );

    return (
        <div className="">
            <div className="absolute left-0 top-9">
                <div ref={iconRef}>
                    <FaCircle
                        onClick={toggleModal}
                        className="text-xl ml-6 cursor-pointer text-green-700 hover:text-orange-500 transition-colors"
                    />
                </div>
                <div className="absolute left-0 mt-2 w-[100vw] z-10">
                    {/* Always show the background with content based on loading or address status */}
                    <div className="mt-2 bg-[#FDF7E4] p-2 min-h-[50px] rounded-xl flex items-center justify-center">
                        {isLoading ? (
                            <LoadingAnimation />
                        ) : defaultAddress ? (
                            <div 
                                ref={defaultAddressRef}
                                className="cursor-pointer flex items-center justify-between w-full"
                                onClick={toggleModal}
                            >
                                <div className="text-xs ml-2 text-gray-600 w-[80vw]">
                                    <p className="font-semibold">{defaultAddress.address}</p>
                                    <p>{defaultAddress.city}, {defaultAddress.postalCode}</p>
                                </div>
                                <FaChevronDown 
                                    className={`mr-[7rem] text-sm mb-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                                />
                            </div>
                        ) : (
                            <button
                                onClick={handleAddAddress}
                                className="w-full px-4 py-2 text-sm text-green-700 transition-colors flex items-center"
                            >
                                <FaPlus className="mr-2" /> Add Address
                            </button>
                        )}
                    </div>
                    
                    <div 
                        ref={modalRef}
                        className={`
                            transform transition-all duration-300 ease-in-out origin-top
                            ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0'}
                        `}
                    >
                        {isOpen && (
                            <div className="w-[85vw] h-[38vh] rounded-b-2xl overflow-scroll bg-[#FDF7E4] border-t border-gray-200 p-4 shadow-lg space-y-2">
                                {userAddresses.length > 0 && (
                                    <div className="space-y-1">
                                        {userAddresses.map((addr) => (
                                            <div 
                                                key={addr._id} 
                                                onClick={() => handleSelectAddress(addr._id)}
                                                className={`
                                                    bg-[#FDF7E4] rounded-lg p-3 border cursor-pointer 
                                                    ${addr.isDefault ? 'border-green-500' : 'hover:border-orange-500'}
                                                    transition-colors
                                                `}
                                            >
                                                {addr.isDefault && (
                                                    <div className="flex items-center text-green-500 text-xs mb-1">
                                                        <FaCheck className="mr-1" /> Default Address
                                                    </div>
                                                )}
                                                <p className="font-semibold text-sm text-gray-700">{addr.address}</p>
                                                <p className="text-xs text-gray-600">
                                                    {addr.city}, {addr.postalCode}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Address Button */}
                                <button
                                    onClick={handleAddAddress}
                                    className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                                >
                                    <FaPlus className="mr-2" /> Add New Address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderAddressModal;