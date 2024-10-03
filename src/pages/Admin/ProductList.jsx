import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(c => c._id === category);
      setSubcategories(selectedCategory?.subcategories || []);
      setSubcategory(""); // Reset subcategory when category changes
    }
  }, [category, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("subcategory", subcategory);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

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
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto px-4 bg-amber-50">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-6 mt-9">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px] rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block w-full text-center rounded-lg cursor-pointer font-semibold py-4 bg-amber-600 text-white hover:bg-amber-700 transition duration-300">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-amber-800 font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-amber-800 font-medium mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-amber-800 font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-amber-800 font-medium mb-2">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-amber-800 font-medium mb-2">Count In Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-amber-800 font-medium mb-2">Category</label>
                <select
                  id="category"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                <label htmlFor="subcategory" className="block text-amber-800 font-medium mb-2">Subcategory</label>
                <select
                  id="subcategory"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  disabled={!category}
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
              <label htmlFor="description" className="block text-amber-800 font-medium mb-2">Description</label>
              <textarea
                id="description"
                rows="4"
                className="w-full p-3 border border-amber-300 rounded-lg bg-white text-amber-900"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg text-lg font-bold bg-amber-600 text-white hover:bg-amber-700 transition duration-300"
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