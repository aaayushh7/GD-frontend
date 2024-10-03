import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row">
        <section className="md:mr-8 mb-6 md:mb-0">
          <div className="flex md:flex-col">
            {["Write Your Review", "All Reviews", "Related Products"].map((tabName, index) => (
              <div
                key={index}
                className={`flex-1 p-3 cursor-pointer text-lg mb-2 rounded-lg transition-colors ${
                  activeTab === index + 1
                    ? "bg-amber-500 text-white font-semibold"
                    : "text-amber-800 hover:bg-amber-100"
                }`}
                onClick={() => handleTabClick(index + 1)}
              >
                {tabName}
              </div>
            ))}
          </div>
        </section>

        <section className="flex-grow">
          {activeTab === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Write Your Review</h2>
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-lg mb-2 text-amber-700">
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select</option>
                      <option value="1">Inferior</option>
                      <option value="2">Decent</option>
                      <option value="3">Great</option>
                      <option value="4">Excellent</option>
                      <option value="5">Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-lg mb-2 text-amber-700">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <p className="text-amber-700">
                  Please <Link to="/login" className="text-amber-600 underline">sign in</Link> to write a review
                </p>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Customer Reviews</h2>
              {product.reviews.length === 0 ? (
                <p className="text-amber-700 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-amber-50 p-4 rounded-lg border border-amber-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-amber-800">{review.name}</strong>
                        <p className="text-amber-600 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Ratings value={review.rating} />
                      <p className="mt-3 text-amber-900">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!data ? (
                  <Loader />
                ) : (
                  data.map((product) => (
                    <SmallProduct key={product._id} product={product} />
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductTabs;