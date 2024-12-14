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
import { Search, Pencil, Trash2 } from "lucide-react";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-amber-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-amber-800 mb-6">Manage Categories</h1>
              
              <div className="mb-8">
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

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-amber-700 mb-4">Category List</h2>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-amber-400 w-5 h-5" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-amber-100">
                        <th className="px-4 py-3 text-left text-amber-800 font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-amber-800 font-semibold">Image URL</th>
                        <th className="px-4 py-3 text-center text-amber-800 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories?.map((category) => (
                        <tr 
                          key={category._id}
                          className="border-b border-amber-100 hover:bg-amber-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-amber-800">{category.name}</td>
                          <td className="px-4 py-3 text-amber-800 truncate max-w-xs">
                            {category.image || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setModalVisible(true);
                                  setSelectedCategory(category);
                                  setUpdatingName(category.name);
                                  setUpdatingImage(category.image || '');
                                }}
                                className="p-2 text-amber-600 hover:text-amber-800 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  handleDeleteCategory();
                                }}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
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
  );
};

export default CategoryList;