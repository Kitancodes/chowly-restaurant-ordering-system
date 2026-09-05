function OrderSummaryPanel({ cart, cartTotal, onPlaceOrder }) {
  return (
    <aside className="mt-8 hidden lg:sticky lg:top-24 lg:mt-0 lg:block">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-base font-medium">Your Order</h3>
        {cart.length === 0 ? (
          <p className="text-sm text-white/40">Nothing added yet.</p>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate">{item.name}</p>
                    <p className="text-xs text-white/40">
                      {item.quantity} × ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-amber-400">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="my-4 border-t border-white/10" />
            <div className="mb-4 flex items-center justify-between text-sm font-medium">
              <span>Total</span>
              <span className="text-amber-400">₦{cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={onPlaceOrder}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-black hover:bg-amber-400"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export default OrderSummaryPanel;