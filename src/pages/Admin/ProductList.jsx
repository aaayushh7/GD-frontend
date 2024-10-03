import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    quantity: "",
    brand: "",
    countInStock: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories, refetch: refetchCategories } = useFetchCategoriesQuery();

  const [subcategories, setSubcategories] = useState([]);

  const updateSubcategories = useCallback((categoryId) => {
    if (categoryId) {
      const selectedCategory = categories?.find(c => c._id === categoryId);
      setSubcategories(selectedCategory?.subcategories || []);
      setFormData(prev => ({ ...prev, subcategory: "" })); // Reset subcategory when category changes
    } else {
      setSubcategories([]);
    }
  }, [categories]);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "category") {
      updateSubcategories(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      Object.keys(formData).forEach(key => {
        productData.append(key, formData[key]);
      });
      if (image) {
        productData.append('image', image);
      }

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(file);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto px-4 bg-white">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 mt-9 bg-yellow-100 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-black mb-6">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl}
                alt="product"
                className="mx-auto max-h-[200px] rounded-lg shadow-md"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <label className="block w-full text-center rounded-lg cursor-pointer font-semibold py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition duration-300">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "price", label: "Price", type: "number" },
                { name: "quantity", label: "Quantity", type: "number" },
                { name: "brand", label: "Brand", type: "text" },
                { name: "countInStock", label: "Count In Stock", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-black font-medium mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-yellow-400 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              ))}

              <div>
                <label htmlFor="category" className="block text-black font-medium mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-yellow-400 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-black font-medium mb-2">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full p-3 border border-yellow-400 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-black font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-yellow-400 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition duration-300"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
