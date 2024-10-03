import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="text-amber-700 font-semibold hover:text-amber-800 flex items-center mb-6 mt-9"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-slate-800">₹ {product.price}</span>
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <FaStore className="mr-2 text-amber-500" /> Brand: {product.brand}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaClock className="mr-2 text-amber-500" /> Added: {moment(product.createAt).fromNow()}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaShoppingCart className="mr-2 text-amber-500" /> Quantity: {product.quantity}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaBox className="mr-2 text-amber-500" /> In Stock: {product.countInStock}
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-20 rounded-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 py-8 text-black">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Product Details</h3>
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;