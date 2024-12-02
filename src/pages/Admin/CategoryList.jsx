import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name, image }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setImage("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
          image: updatingImage,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setUpdatingImage("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="flex-1 p-6 md:p-8 lg:p-10 mt-9">
          <h1 className="text-3xl font-bold text-amber-800 mb-8">Manage Categories</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Create New Category</h2>
            <CategoryForm
              name={name}
              setName={setName}
              image={image}
              setImage={setImage}
              handleSubmit={handleCreateCategory}
              buttonText="Create Category"
              buttonClass="bg-amber-600 hover:bg-amber-700 text-white"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Existing Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center gap-2 bg-amber-100 rounded-full overflow-hidden hover:bg-amber-200 transition-all duration-300"
                >
                  
                  <button
                    className="py-2 px-4 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                      setUpdatingImage(category.image || '');
                    }}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Update Category</h2>
              <CategoryForm
                name={updatingName}
                setName={setUpdatingName}
                image={updatingImage}
                setImage={setUpdatingImage}
                handleSubmit={handleUpdateCategory}
                buttonText="Update"
                handleDelete={handleDeleteCategory}
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

export default CategoryList;