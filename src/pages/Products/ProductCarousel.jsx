import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 mt-[10%]  bg p-10 border-r-4 w-full lg:w-[85%] mx-auto lg:mr-[50px] lg:pl-8">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
          {products.map(({
            image,
            _id,
            name,
            price,
            description,
            brand,
            createdAt,
            numReviews,
            rating,
            quantity,
            countInStock,
          }) => (
            <div key={_id} className="outline-none">
              <div className="flex flex-col lg:flex-row gap-4">
                <img
                  src={image}
                  alt={name}
                  className="w-full lg:w-1/2 rounded-lg object-cover h-[300px] lg:h-[400px]"
                />
                <div className="flex flex-col justify-between lg:w-1/2">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-2">{name}</h2>
                    <p className="text-lg lg:text-xl font-semibold mb-4">₹ {price}</p>
                    <p className="mb-4 line-clamp-3 text-sm lg:text-base">{description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 lg:gap-4 text-sm lg:text-base">
                    <div>
                      <p className="flex items-center mb-2">
                        <FaStore className="mr-2 text-gray-600" /> <span className="font-semibold">Brand:</span> {brand}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaClock className="mr-2 text-gray-600" /> <span className="font-semibold">Added:</span> {moment(createdAt).fromNow()}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaStar className="mr-2 text-gray-600" /> <span className="font-semibold">Reviews:</span> {numReviews}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center mb-2">
                        <FaStar className="mr-2 text-gray-600" /> <span className="font-semibold">Rating:</span> {rating.toFixed(1)}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaShoppingCart className="mr-2 text-gray-600" /> <span className="font-semibold">Quantity:</span> {quantity}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaBox className="mr-2 text-gray-600" /> <span className="font-semibold">In Stock:</span> {countInStock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;