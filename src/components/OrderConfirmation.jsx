function OrderConfirmation({ order, onBackToMenu }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-medium">Order Confirmed</h1>
        <p className="text-xs text-white/50">The Yellow Chilli · Table 07</p>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-light">Thank you!</h2>
          <p className="mt-2 text-white/60">
            Your order has been sent to the kitchen
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-start justify-between gap-8">
            <div>
              <p className="text-xs text-white/50">Order Number</p>
              <p className="mt-1 text-lg font-medium text-amber-400">
                {order.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Status</p>
              <p className="inline-flex rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                {currentOrder.status}
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p>{item.quantity}× {item.name}</p>
                  <p className="text-xs text-white/40">{item.prepTime} min prep</p>
                </div>
                <p className="text-amber-400">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-white/60">Estimated Wait</span>
              <span className="font-medium text-amber-300">
                {order.waitingTime} minutes
              </span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span className="text-amber-400">
                ₦{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onBackToMenu}
          className="mt-8 w-full rounded-xl bg-amber-500 py-3.5 font-semibold text-black transition-all hover:bg-amber-400"
        >
          Back to Menu
        </button>
      </main>
    </div>
  );
}

export default OrderConfirmation;