import { createSlice } from "@reduxjs/toolkit";

const loadFavoritesFromStorage = () => {
  try {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: loadFavoritesFromStorage(),
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
        saveFavoritesToStorage(state);
      }
    },
    removeFromFavorites: (state, action) => {
      const updatedState = state.filter((product) => product._id !== action.payload);
      saveFavoritesToStorage(updatedState);
      return updatedState;
    },
    setFavorites: (state, action) => {
      saveFavoritesToStorage(action.payload);
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;