import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),

    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/categories`,
    }),
    createSubcategory: builder.mutation({
      query: (subcategoryData) => ({
        url: `/api/subcategory`,
        method: 'POST',
        body: subcategoryData,
      }),
    }),
    updateSubcategory: builder.mutation({
      query: ({ subcategoryId, updatedSubcategory }) => ({
        url: `/api/subcategory/${subcategoryId}`, 
        method: 'PUT',
        body: updatedSubcategory,
      }),
    }),
    deleteSubcategory: builder.mutation({
      query: (subcategoryId) => ({
        url: `/api/subcategory/${subcategoryId}`,
        method: 'DELETE',
      }),
    }),
    fetchSubcategories: builder.query({
      query: () => `/api/subcategory`, 
      providesTags: ["Subcategory"],
    }),
    fetchSubcategoriesByCategory: builder.query({
      query: (categoryId) => `/api/category/${categoryId}/subcategories`,
      providesTags: (result, error, categoryId) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Subcategory', id })),
              { type: 'Subcategory', id: 'LIST' },
            ]
          : [{ type: 'Subcategory', id: 'LIST' }],
    }),
  

  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useFetchSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useFetchSubcategoriesByCategoryQuery, // Add this new export

} = categoryApiSlice;
