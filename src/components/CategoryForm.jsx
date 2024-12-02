const CategoryForm = ({
  name,
  setName,
  image,
  setImage,
  handleSubmit,
  buttonText,
  handleDelete,
  buttonClass,
  deleteButtonClass,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg ${buttonClass}`}
        >
          {buttonText}
        </button>
        {handleDelete && (
          <button
            onClick={handleDelete}
            type="button"
            className={`px-6 py-2 rounded-lg ${deleteButtonClass}`}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;