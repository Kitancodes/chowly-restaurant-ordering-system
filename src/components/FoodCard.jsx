
export default function FoodCard({
  item,
  quantity,
  updateQuantity,
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-amber-500/30">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-amber-300 backdrop-blur">
          {item.prepTime} min
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex justify-between gap-2">
          <h3 className="text-lg font-medium">
            {item.name}
          </h3>

          <span className="font-medium text-amber-400">
            ₦{item.price.toLocaleString()}
          </span>
        </div>

        <p className="mb-4 text-sm text-white/50">
          {item.description}
        </p>

        <div className="mt-auto">
          {quantity === 0 ? (
            <button
              onClick={() => updateQuantity(item, 1)}
              className="w-full rounded-xl bg-amber-500 py-2.5 font-semibold text-black transition hover:bg-amber-400"
            >
              Add to Order
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-2 py-1.5">
              <button
                onClick={() => updateQuantity(item, -1)}
                className="h-8 w-8 rounded-lg bg-white/10 text-lg text-white hover:bg-white/20"
              >
                −
              </button>

              <span className="font-semibold text-amber-300">
                {quantity} in order
              </span>

              <button
                onClick={() => updateQuantity(item, 1)}
                className="h-8 w-8 rounded-lg bg-amber-500 text-lg text-black hover:bg-amber-400"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}