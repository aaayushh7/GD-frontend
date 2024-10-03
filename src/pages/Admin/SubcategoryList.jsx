import React, { useState, useCallback, useMemo } from "react";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useFetchSubcategoriesQuery,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const SubcategoryList = () => {
  const { data: subcategories } = useFetchSubcategoriesQuery();
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const handleCreateSubcategory = useCallback(async (e) => {
    e.preventDefault();
    if (!name || !parentId) {
      toast.error("Subcategory name and parent category are required");
      return;
    }
    try {
      const result = await createSubcategory({ name, parentId }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setParentId("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating subcategory failed, try again.");
    }
  }, [name, parentId, createSubcategory]);

  const handleUpdateSubcategory = useCallback(async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Subcategory name is required");
      return;
    }
    try {
      const result = await updateSubcategory({
        subcategoryId: selectedSubcategory._id,
        updatedSubcategory: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedSubcategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating subcategory failed, try again.");
    }
  }, [updatingName, selectedSubcategory, updateSubcategory]);

  const handleDeleteSubcategory = useCallback(async () => {
    try {
      const result = await deleteSubcategory(selectedSubcategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Subcategory deleted successfully`);
        setSelectedSubcategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Subcategory deletion failed. Try again.");
    }
  }, [selectedSubcategory, deleteSubcategory]);

  const categoryOptions = useMemo(() =>
    categories?.map(category => ({
      value: category._id,
      label: category.name
    })) || [],
    [categories]
  );

  return (
    <div className="bg-yellow-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="flex-1 p-6 md:p-8 lg:p-10 mt-9">
            <h1 className="text-3xl font-bold text-yellow-800 mb-8">Manage Subcategories</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-700 mb-4">Create New Subcategory</h2>
              <form onSubmit={handleCreateSubcategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Parent Category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
                  Create Subcategory
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-700 mb-4">Existing Subcategories</h2>
              <div className="flex flex-wrap gap-3">
                {subcategories?.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-full hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-300"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedSubcategory(subcategory);
                      setUpdatingName(subcategory.name);
                    }}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">Update Subcategory</h2>
                <form onSubmit={handleUpdateSubcategory} className="space-y-4">
                  <input
                    type="text"
                    value={updatingName}
                    onChange={(e) => setUpdatingName(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <div className="flex justify-between">
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
                      Update
                    </button>
                    <button type="button" onClick={handleDeleteSubcategory} className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-300">
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryList;
