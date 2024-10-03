import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  if (favoriteCount === 0) {
    return null;
  }

  return (
    <div className="absolute -top-2 -right-2 z-10">
      <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-amber-600 rounded-full shadow-md transition-all duration-300 hover:bg-amber-700">
        {favoriteCount}
      </span>
    </div>
  );
};

export default FavoritesCount;