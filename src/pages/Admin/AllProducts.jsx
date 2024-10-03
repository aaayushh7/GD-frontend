import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-amber-600 text-center text-xl">Error loading products</div>;
  }

  return (
    <div className="bg-amber-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/4 p-4">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">
              All Products ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-amber-900 truncate">
                        {product?.name}
                      </h3>
                      <p className="text-amber-600 text-sm">
                        ${product?.price}
                      </p>
                    </div>
                    <p className="text-amber-700 text-sm mb-4 line-clamp-3">
                      {product?.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-500 text-xs">
                        {moment(product.createdAt).format("MMMM Do YYYY")}
                      </span>
                      <button className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700 transition-colors">
                        Update
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Admin Menu</h3>
              <AdminMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;