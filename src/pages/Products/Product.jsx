import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
        
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-amber-600 transition-colors">
            {product.name}
          </h2>
        </Link>
        
        <div className="flex items-center mb-2">
          <FaStar className="text-amber-400 mr-1" />
          <span className="text-gray-600">{product.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-sm ml-1">({product.numReviews} reviews)</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {product.description.substring(0, 100)}...
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-amber-600">₹ {product.price.toFixed(2)}</span>
          <Link 
            to={`/product/${product._id}`}
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;