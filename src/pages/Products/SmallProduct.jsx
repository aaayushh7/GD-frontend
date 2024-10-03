import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full bg-amber-50 rounded-lg shadow-md">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-auto rounded-t-lg"
        />
        <HeartIcon product={product} />
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-amber-900">
            <div className="font-semibold">{product.name}</div>
            <span className="bg-amber-200 text-amber-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
              ₹{product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;