import React, { useState } from "react";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useFetchSubcategoriesQuery,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import SubcategoryForm from "../../components/SubcategoryForm";
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

  const handleCreateSubcategory = async (e) => {
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
  };

  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Subcategory name is required");
      return;
    }

    try {
      const result = await updateSubcategory({
        subcategoryId: selectedSubcategory._id,
        updatedSubcategory: {
          name: updatingName,
        },
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
  };

  const handleDeleteSubcategory = async () => {
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
  };

//   if (isLoadingSubcategories || isLoadingCategories) {
//     return <div>Loading...</div>;
//   }

  return (
    <div className="bg-amber-50 min-h-screen container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="flex-1 p-6 md:p-8 lg:p-10 mt-9">
          <h1 className="text-3xl font-bold text-amber-800 mb-8">Manage Subcategories</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Create New Subcategory</h2>
            <SubcategoryForm
              name={name}
              setName={setName}
              parentId={parentId}
              setParentId={setParentId}
              categories={categories}
              handleSubmit={handleCreateSubcategory}
              buttonText="Create Subcategory"
              buttonClass="bg-amber-600 hover:bg-amber-700 text-white"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Existing Subcategories</h2>
            <div className="flex flex-wrap gap-3">
              {subcategories?.map((subcategory) => (
                <button
                  key={subcategory._id}
                  className="bg-amber-100 text-amber-800 py-2 px-4 rounded-full hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300"
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
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Update Subcategory</h2>
              <SubcategoryForm
                name={updatingName}
                setName={setUpdatingName}
                handleSubmit={handleUpdateSubcategory}
                buttonText="Update"
                handleDelete={handleDeleteSubcategory}
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

export default SubcategoryList;