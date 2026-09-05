function CustomerOrdersList({ orders, onRate, onPay }) {
  if (orders.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="mb-4 text-lg font-light">Your Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-400">{order.id}</p>
                <p className="mt-1 text-xs text-white/50">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {order.status}
                </p>
              </div>
              {order.paid && (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                  Paid
                </span>
              )}
            </div>

            <div className="mb-3 space-y-1">
              {order.items.map((item) => (
                <p key={item.id} className="text-sm text-white/70">
                  {item.quantity}× {item.name}
                </p>
              ))}
            </div>

            <div className="mb-4 flex justify-between text-sm">
              <span className="text-white/50">Wait: {order.waitingTime} min</span>
              <span className="font-medium text-amber-400">
                ₦{order.total.toLocaleString()}
              </span>
            </div>

            {!order.rating ? (
              <button
                onClick={() => onRate(order.id)}
                className="mb-3 w-full rounded-xl border border-white/20 py-2.5 text-sm text-white/70 hover:bg-white/5"
              >
                Rate / Submit Complaint
              </button>
            ) : (
              <div className="mb-3 rounded-xl bg-white/5 p-3 text-sm">
                <p className="text-amber-300">
                  Rating: {"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}
                </p>
                <p className="mt-1 text-white/60">{order.complaint}</p>
              </div>
            )}

            {order.status === "Served" && !order.paid && (
              <button
                onClick={() => onPay(order.id)}
                className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
              >
                Pay Now (Pretend Payment)
              </button>
            )}

            {order.paid && (
              <p className="text-center text-xs text-green-400">
                Paid · Ref: {order.paymentRef}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerOrdersList;