import React, { useState, useEffect, useRef } from 'react';
import { FaLocationArrow, FaPlus, FaCheck, FaChevronDown, FaCircle } from 'react-icons/fa';
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
    const defaultAddressRef = useRef(null);
    const navigate = useNavigate();

    const {
        data: userAddresses,
        isLoading
    } = useGetUserAddressesQuery();

    const defaultAddress = userAddresses?.find(addr => addr.isDefault);

    const [addAddress] = useSaveAddressMutation();
    const [setDefaultAddress] = useSetDefaultAddressMutation();

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
                setIsAddingAddress(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalRef, iconRef, defaultAddressRef]);

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

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setIsAddingAddress(false);
    };

    return (
        <div className="relative">
            <div className="absolute -left-[7rem] -top-2">
                <div ref={iconRef}>
                    <FaCircle
                        onClick={toggleModal}
                        className="text-xl cursor-pointer text-green-700 hover:text-orange-500 transition-colors"
                    />
                </div>
                {defaultAddress && !isLoading && (
                    <div className="absolute -left-[22px] mt-2 w-[100vw] z-50">
                        <div 
                            ref={defaultAddressRef}
                            className="mt-2 bg-[#FDF7E4] p-2 cursor-pointer flex items-center justify-between"
                            onClick={toggleModal}
                        >
                            <div className="text-xs ml-2 text-gray-600 w-[80vw">
                                <p className="font-semibold">{defaultAddress.address}</p>
                                <p>{defaultAddress.city}, {defaultAddress.postalCode}</p>
                            </div>
                            <FaChevronDown 
                                className={`mr-[7rem] text-sm mb-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                            />
                        </div>
                        
                        <div 
                            ref={modalRef}
                            className={`
                                transform transition-all duration-300 ease-in-out origin-top
                                ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0'}
                            `}
                        >
                            {isOpen && (
                                <div className="w-[80vw] bg-[#FDF7E4] border-t border-gray-200 p-4 shadow-lg">
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
                                                {userAddresses
                                                    .filter(addr => !addr.isDefault)
                                                    .map((addr) => (
                                                        <div
                                                            key={addr._id}
                                                            className={`
                                                                flex justify-between items-center p-2 border rounded mb-1 cursor-pointer
                                                                hover:bg-orange-100
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderAddressModal;