function FloatingCart({ count, total, onClick }) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      <button
        onClick={onClick}
        className="flex items-center gap-3 rounded-full bg-amber-500 px-5 py-3.5 font-semibold text-black shadow-2xl shadow-amber-500/30 transition-all hover:scale-[1.02]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-amber-400">
          {count}
        </span>

        <span>Place Order</span>

        <span className="opacity-80">
          ₦{total.toLocaleString()}
        </span>
      </button>
    </div>
  );
}

export default FloatingCart;