import React, { useState, useEffect, useRef } from 'react';
import { FaLocationArrow, FaPlus, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    useGetUserAddressesQuery,
    useSaveAddressMutation,
    useSetDefaultAddressMutation
} from "../../redux/api/addressApiSlice";

const HeaderAddressModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const modalRef = useRef(null);
    const iconRef = useRef(null);
    const navigate = useNavigate();

    const {
        data: userAddresses,
        isLoading
    } = useGetUserAddressesQuery();

    const [addAddress] = useSaveAddressMutation();
    const [setDefaultAddress] = useSetDefaultAddressMutation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Ensure both modalRef and iconRef are defined before accessing `contains`
            if (
                modalRef.current &&
                iconRef.current &&
                !modalRef.current.contains(event.target) &&
                !iconRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setIsAddingAddress(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalRef, iconRef]);


    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        try {
            await addAddress(newAddress).unwrap();
            setIsAddingAddress(false);
            setNewAddress({
                address: '',
                city: '',
                postalCode: '',
                country: ''
            });
        } catch (error) {
            console.error('Failed to add address', error);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            await setDefaultAddress(addressId).unwrap();
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to set default address', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="relative">
            <div ref={iconRef}>
                <FaLocationArrow
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xl cursor-pointer absolute -left-[7rem] -top-2 text-orange-500 hover:text-gray-700 transition-colors"
                />
            </div>

            {isOpen && (
                <div
                    ref={modalRef}
                    className="absolute -left-[7.5rem] top-4 w-[18rem] bg-orange-50 border border-gray-400 rounded-lg z-50 p-4"
                >
                    <h3 className="text-sm font-medium text-gray-900 mb-2 underline">
                        Delivery Address
                    </h3>

                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading addresses...</p>
                    ) : isAddingAddress ? (
                        <form onSubmit={handleAddNewAddress} className="space-y-2">
                            <input
                                type="text"
                                name="address"
                                value={newAddress.address}
                                onChange={handleInputChange}
                                placeholder="Street Address"
                                className="w-full px-2 py-1 text-xs border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full px-2 py-1 text-xs border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="postalCode"
                                value={newAddress.postalCode}
                                onChange={handleInputChange}
                                placeholder="Postal Code"
                                className="w-full px-2 py-1 text-xs border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                                placeholder="Country"
                                className="w-full px-2 py-1 text-xs border rounded"
                                required
                            />
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Save Address
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAddress(false)}
                                    className="w-full px-4 py-2 text-sm text-orange-500 border border-orange-500 rounded-md hover:bg-orange-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : userAddresses && userAddresses.length > 0 ? (
                        <div className="space-y-2">
                            <div className="max-h-48 overflow-y-auto">
                                {userAddresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className={`
                      flex justify-between items-center p-2 border rounded mb-1 cursor-pointer
                      ${addr.isDefault
                                                ? 'bg-green-50 border-green-200'
                                                : 'hover:bg-orange-100'}
                    `}
                                        onClick={() => handleSetDefaultAddress(addr._id)}
                                    >
                                        <div className="text-xs text-gray-600 flex-grow">
                                            <p className="font-semibold">
                                                {addr.address}
                                            </p>
                                            <p>
                                                {addr.city}, {addr.postalCode}
                                            </p>
                                            <p>
                                                {addr.country}
                                            </p>
                                        </div>
                                        {addr.isDefault && (
                                            <FaCheck
                                                className="text-green-500 ml-2"
                                                title="Default Address"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsAddingAddress(true)}
                                className="w-full mt-2 px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                            >
                                <FaPlus className="mr-2" /> Add New Address
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingAddress(true)}
                            className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                        >
                            <FaPlus className="mr-2" /> Add Address
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderAddressModal;