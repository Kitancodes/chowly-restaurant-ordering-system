function WaiterDashboard({ orders, staff, selectedOrderId, onSelectOrder, selectedOrder, onUpdateOrder }) {
  if (orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <p className="text-white/30">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order.id)}
            className={`cursor-pointer rounded-2xl border p-5 transition-all ${
              selectedOrderId === order.id
                ? "border-amber-500/50 bg-amber-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-400">{order.id}</p>
                <p className="mt-1 text-xs text-white/50">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Table 07
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  order.status === "Paid"
                    ? "bg-purple-500/20 text-purple-300"
                    : order.status === "Served"
                    ? "bg-green-500/20 text-green-300"
                    : order.status === "Ready"
                    ? "bg-blue-500/20 text-blue-300"
                    : order.status === "Preparing"
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-3 space-y-1">
              {order.items.map((item) => (
                <p key={item.id} className="text-sm text-white/70">
                  {item.quantity}× {item.name}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Wait: {order.waitingTime} min</span>
              <span className="font-medium text-amber-400">
                ₦{order.total.toLocaleString()}
              </span>
            </div>

            {(order.chef || order.bartender) && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
                {order.chef && <span>Chef: {order.chef}</span>}
                {order.bartender && <span>Bartender: {order.bartender}</span>}
              </div>
            )}

            {order.rating && (
              <div className="mt-3 text-xs text-amber-300">
                Customer Rating: {"★".repeat(order.rating)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-24">
        {selectedOrder ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-1 text-lg font-medium">{selectedOrder.id}</h3>
            <p className="mb-6 text-sm text-white/50">Status: {selectedOrder.status}</p>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-white/60">Assign Chef</label>
              <select
                value={selectedOrder.chef || ""}
                onChange={(e) =>
                  onUpdateOrder(selectedOrder.id, {
                    chef: e.target.value,
                    status: selectedOrder.status === "Pending" ? "Preparing" : selectedOrder.status,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
              >
                <option value="">Select Chef</option>
                {staff.filter((s) => s.role === "Chef").map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-white/60">Assign Bartender</label>
              <select
                value={selectedOrder.bartender || ""}
                onChange={(e) => onUpdateOrder(selectedOrder.id, { bartender: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
              >
                <option value="">Select Bartender</option>
                {staff.filter((s) => s.role === "Bartender").map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {selectedOrder.status !== "Ready" &&
                selectedOrder.status !== "Served" &&
                selectedOrder.status !== "Paid" && (
                  <button
                    onClick={() => onUpdateOrder(selectedOrder.id, { status: "Ready" })}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Mark as Ready
                  </button>
                )}

              {selectedOrder.status !== "Served" && selectedOrder.status !== "Paid" && (
                <button
                  onClick={() => onUpdateOrder(selectedOrder.id, { status: "Served" })}
                  className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  Mark as Served
                </button>
              )}
            </div>

            {selectedOrder.complaint && (
              <div className="mt-6 rounded-xl bg-red-500/10 p-3 text-sm">
                <p className="text-red-300">Customer Complaint</p>
                <p className="mt-1 text-white/70">{selectedOrder.complaint}</p>
                <p className="mt-1 text-amber-300">Rating: {"★".repeat(selectedOrder.rating)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-white/30">Select an order to manage</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaiterDashboard;