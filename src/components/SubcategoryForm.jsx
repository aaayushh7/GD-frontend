/* eslint-disable react/prop-types */
import React from "react";

const SubcategoryForm = ({
  name,
  setName,
  parentId,
  setParentId,
  categories,
  handleSubmit,
  buttonText,
  handleDelete,
  buttonClass,
  deleteButtonClass,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Subcategory Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {setParentId && (
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <select
            id="parentId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            required
          >
            <option value="">Select a parent category</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-between">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${buttonClass}`}
        >
          {buttonText}
        </button>
        {handleDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className={`px-4 py-2 rounded-md ${deleteButtonClass}`}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default SubcategoryForm;