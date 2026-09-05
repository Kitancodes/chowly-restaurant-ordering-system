
import FoodCard from "./FoodCard";

export default function MenuSection({
  menuItems,
  categories,
  activeCategory,
  setActiveCategory,
  quantityOf,
  updateQuantity,
}) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-light sm:text-2xl">
          Welcome to your table
        </h2>

        <p className="mt-1 text-sm text-white/50 sm:text-base">
          What would you like to order today?
        </p>
      </div>

      <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeCategory === cat
                ? "bg-amber-500 text-black"
                : "border border-white/10 bg-white/5 text-white/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            quantity={quantityOf(item.id)}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>
    </>
  );
}