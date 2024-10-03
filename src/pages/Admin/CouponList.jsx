import { useState } from "react";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useFetchCouponsQuery,
} from "../../redux/api/orderApiSlice";  // Update this import path as needed

import { toast } from "react-toastify";
import CouponForm from "../../components/CouponForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CouponList = () => {
  const { data: coupons, isLoading, isError, error } = useFetchCouponsQuery();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [updatingCode, setUpdatingCode] = useState("");
  const [updatingDiscount, setUpdatingDiscount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (!code || !discount) {
      toast.error("Coupon code and discount are required");
      return;
    }

    try {
      const result = await createCoupon({ code, discount: Number(discount) }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setCode("");
        setDiscount("");
        toast.success(`Coupon ${result.code} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating coupon failed, try again.");
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();

    if (!updatingCode || !updatingDiscount) {
      toast.error("Coupon code and discount are required");
      return;
    }

    try {
      const result = await updateCoupon({
        couponId: selectedCoupon._id,
        updatedCoupon: {
          code: updatingCode,
          discount: Number(updatingDiscount),
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Coupon ${result.code} is updated`);
        setSelectedCoupon(null);
        setUpdatingCode("");
        setUpdatingDiscount("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating coupon failed, try again.");
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      const result = await deleteCoupon(selectedCoupon._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Coupon ${result.code} is deleted.`);
        setSelectedCoupon(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Coupon deletion failed. Try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-amber-50 min-h-screen container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="flex-1 p-6 md:p-8 lg:p-10 mt-9">
          <h1 className="text-3xl font-bold text-amber-800 mb-8">Manage Coupons</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Create New Coupon</h2>
            <CouponForm
              code={code}
              setCode={setCode}
              discount={discount}
              setDiscount={setDiscount}
              handleSubmit={handleCreateCoupon}
              buttonText="Create Coupon"
              buttonClass="bg-amber-600 hover:bg-amber-700 text-white"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Existing Coupons</h2>
            <div className="flex flex-wrap gap-3">
              {coupons?.map((coupon) => (
                <button
                  key={coupon._id}
                  className="bg-amber-100 text-amber-800 py-2 px-4 rounded-full hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCoupon(coupon);
                    setUpdatingCode(coupon.code);
                    setUpdatingDiscount(coupon.discount);
                  }}
                >
                  {coupon.code} - {coupon.discount}%
                </button>
              ))}
            </div>
          </div>

          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Update Coupon</h2>
              <CouponForm
                code={updatingCode}
                setCode={setUpdatingCode}
                discount={updatingDiscount}
                setDiscount={setUpdatingDiscount}
                handleSubmit={handleUpdateCoupon}
                buttonText="Update"
                handleDelete={handleDeleteCoupon}
                buttonClass="bg-amber-600 hover:bg-amber-700 text-white"
                deleteButtonClass="bg-red-600 hover:bg-red-700 text-white"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CouponList;