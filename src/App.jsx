import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const categories = ["All", "Mains", "Starters", "Drinks"];

// Server order items come back nested as { id, menuItemId, quantity, price, menuItem: {...} }.
// This flattens them back to the { id, name, price, quantity, prepTime } shape the rest
// of the app already renders, so almost none of the JSX below has to change.
function normalizeOrder(serverOrder) {
  return {
    ...serverOrder,
    items: serverOrder.items.map((oi) => ({
      id: oi.menuItemId,
      name: oi.menuItem.name,
      price: oi.price,
      prepTime: oi.menuItem.prepTime,
      quantity: oi.quantity,
    })),
  };
}

function App() {
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState("customer");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  // Complaint form state
  const [rating, setRating] = useState(0);
  const [complaintText, setComplaintText] = useState("");
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // Load menu, staff, and existing orders once on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuRes, staffRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE}/menu`),
          fetch(`${API_BASE}/staff`),
          fetch(`${API_BASE}/orders`),
        ]);

        if (!menuRes.ok || !staffRes.ok || !ordersRes.ok) {
          throw new Error("One or more requests failed");
        }

        const [menuData, staffData, ordersData] = await Promise.all([
          menuRes.json(),
          staffRes.json(),
          ordersRes.json(),
        ]);

        setMenuItems(menuData);
        setStaff(staffData);
        setOrders(ordersData.map(normalizeOrder));
      } catch (err) {
        console.error(err);
        setMenuError("Couldn't reach the server. Is your backend running on port 5000?");
      } finally {
        setMenuLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const quantityOf = (id) => cart.find((i) => i.id === id)?.quantity ?? 0;

  const updateQuantity = (item, delta) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) {
        return delta > 0 ? [...prev, { ...item, quantity: 1 }] : prev;
      }
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) return prev.filter((i) => i.id !== item.id);
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: nextQty } : i
      );
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const serverOrder = await res.json();
      const newOrder = normalizeOrder(serverOrder);

      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      setCart([]);
      setShowConfirmation(true);
    } catch (err) {
      console.error(err);
      alert("Couldn't place your order. Please try again.");
    }
  };

  const updateOrder = async (orderId, updates) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");

      const serverOrder = await res.json();
      const updated = normalizeOrder(serverOrder);

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updated : order))
      );
    } catch (err) {
      console.error(err);
      alert("Couldn't update the order. Please try again.");
    }
  };

  const submitComplaint = (orderId) => {
    if (rating === 0) return alert("Please select a rating");

    updateOrder(orderId, {
      rating,
      complaint: complaintText || "No additional comment",
    });

    setRating(0);
    setComplaintText("");
    setShowComplaintForm(false);
    alert("Complaint & rating submitted. Thank you for your feedback.");
  };

  const makePayment = (orderId) => {
    const ref = `CHW-${Date.now().toString().slice(-8)}`;
    updateOrder(orderId, {
      paid: true,
      paymentRef: ref,
      status: "Paid",
    });
    alert(`Pretend payment successful!\nReference: ${ref}`);
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // ========== LANDING PAGE ==========
  if (!entered) {
    return (
      <div className="relative min-h-screen overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/20 blur-[120px]" />

        <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex items-start justify-between">
            <p className="text-xs tracking-[0.3em] uppercase text-white/70">
              Powered by Chowly
            </p>
          </div>

          <div className="mt-auto space-y-8 sm:space-y-10">
            <div className="max-w-lg">
              <h1 className="text-5xl font-light leading-none sm:text-6xl md:text-7xl">
                The Yellow
                <br />
                Chilli
              </h1>
              <p className="mt-3 text-xs tracking-[0.3em] uppercase text-amber-300">
                Victoria Island
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                Your table is ready. Explore today's menu, place your order,
                and enjoy a seamless dining experience.
              </p>
            </div>

            <div className="space-y-5">
              <button
                onClick={() => setEntered(true)}
                className="w-full rounded-full bg-amber-500 px-10 py-4 text-lg font-semibold text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 sm:w-auto"
              >
                Enter Restaurant
              </button>
              <p className="text-sm text-white/50">
                Tap to begin your table-side experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== ORDER CONFIRMATION ==========
  if (showConfirmation && currentOrder) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <header className="border-b border-white/10 px-6 py-4">
          <h1 className="text-lg font-medium">Order Confirmed</h1>
          <p className="text-xs text-white/50">The Yellow Chilli</p>
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
                  {currentOrder.orderNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">Status</p>
                <p className="mt-1 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                  {currentOrder.status}
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              {currentOrder.items.map((item) => (
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
                  {currentOrder.waitingTime} minutes
                </span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span className="text-amber-400">
                  ₦{currentOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowConfirmation(false);
              setCurrentOrder(null);
            }}
            className="mt-8 w-full rounded-xl bg-amber-500 py-3.5 font-semibold text-black transition-all hover:bg-amber-400"
          >
            Back to Menu
          </button>
        </main>
      </div>
    );
  }

  // ========== MAIN EXPERIENCE ==========
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D0D0D]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h1 className="text-base font-medium tracking-wide sm:text-lg">
              The Yellow Chilli
              <span className="ml-2 text-sm font-normal text-amber-300">
                · Victoria Island
              </span>
            </h1>
          </div>

          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => {
                setRole("customer");
                setSelectedOrderId(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
                role === "customer"
                  ? "bg-amber-500 text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole("waiter")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
                role === "waiter"
                  ? "bg-amber-500 text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Waiter
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 ${role === "customer" && cartCount > 0 ? "pb-28 lg:pb-8" : "pb-8"}`}>
        {role === "customer" ? (
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl font-light sm:text-2xl">Welcome to your table</h2>
                <p className="mt-1 text-sm text-white/50 sm:text-base">
                  What would you like to order today?
                </p>
              </div>

              {menuLoading ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <p className="text-white/40">Loading menu...</p>
                </div>
              ) : menuError ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 text-center">
                  <p className="text-red-300">{menuError}</p>
                </div>
              ) : (
                <>
                  <div className="no-scrollbar mb-6 flex gap-3 overflow-x-auto pb-2 sm:mb-8">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 ${
                          activeCategory === cat
                            ? "bg-amber-500 text-black"
                            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                    {filteredItems.map((item) => {
                      const qty = quantityOf(item.id);
                      return (
                        <div
                          key={item.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-amber-500/30"
                        >
                          <div className="relative h-44 overflow-hidden sm:h-48">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-amber-300 backdrop-blur">
                              {item.prepTime} min
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col p-4 sm:p-5">
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <h3 className="text-base font-medium sm:text-lg">{item.name}</h3>
                              <p className="whitespace-nowrap font-medium text-amber-400">
                                ₦{item.price.toLocaleString()}
                              </p>
                            </div>
                            <p className="mb-4 text-sm text-white/50 line-clamp-2">{item.description}</p>

                            <div className="mt-auto">
                              {qty === 0 ? (
                                <button
                                  onClick={() => updateQuantity(item, 1)}
                                  className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400"
                                >
                                  Add to Order
                                </button>
                              ) : (
                                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-2 py-1.5">
                                  <button
                                    onClick={() => updateQuantity(item, -1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg font-semibold text-white hover:bg-white/20"
                                  >
                                    −
                                  </button>
                                  <span className="text-sm font-semibold text-amber-300">
                                    {qty} in order
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item, 1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-lg font-semibold text-black hover:bg-amber-400"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Customer Orders Section */}
              {orders.length > 0 && (
                <div className="mt-12">
                  <h3 className="mb-4 text-lg font-light">Your Orders</h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-amber-400">{order.orderNumber}</p>
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
                          <span className="text-white/50">
                            Wait: {order.waitingTime} min
                          </span>
                          <span className="font-medium text-amber-400">
                            ₦{order.total.toLocaleString()}
                          </span>
                        </div>

                        {/* Rating & Complaint */}
                        {!order.rating ? (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowComplaintForm(true);
                            }}
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

                        {/* Payment */}
                        {order.status === "Served" && !order.paid && (
                          <button
                            onClick={() => makePayment(order.id)}
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
              )}
            </div>

            {/* Desktop Cart */}
            <aside className="mt-8 hidden lg:sticky lg:top-24 lg:mt-0 lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 text-base font-medium">Your Order</h3>
                {cart.length === 0 ? (
                  <p className="text-sm text-white/40">
                    Nothing added yet.
                  </p>
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
                      onClick={placeOrder}
                      className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-black hover:bg-amber-400"
                    >
                      Place Order
                    </button>
                  </>
                )}
              </div>
            </aside>
          </div>
        ) : (
          // ==================== WAITER DASHBOARD ====================
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl font-light sm:text-2xl">Waiter Dashboard</h2>
              <p className="mt-1 text-sm text-white/50 sm:text-base">
                Manage and assign orders
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <p className="text-white/30">No orders yet</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                        selectedOrderId === order.id
                          ? "border-amber-500/50 bg-amber-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-amber-400">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-white/50">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

                {/* Detail Panel */}
                <div className="lg:sticky lg:top-24">
                  {selectedOrder ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h3 className="mb-1 text-lg font-medium">{selectedOrder.orderNumber}</h3>
                      <p className="mb-6 text-sm text-white/50">
                        Status: {selectedOrder.status}
                      </p>

                      <div className="mb-5">
                        <label className="mb-2 block text-sm text-white/60">Assign Chef</label>
                        <select
                          value={selectedOrder.chef || ""}
                          onChange={(e) =>
                            updateOrder(selectedOrder.id, {
                              chef: e.target.value,
                              status:
                                selectedOrder.status === "Pending"
                                  ? "Preparing"
                                  : selectedOrder.status,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                        >
                          <option value="">Select Chef</option>
                          {staff
                            .filter((s) => s.role === "Chef")
                            .map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="mb-6">
                        <label className="mb-2 block text-sm text-white/60">
                          Assign Bartender
                        </label>
                        <select
                          value={selectedOrder.bartender || ""}
                          onChange={(e) =>
                            updateOrder(selectedOrder.id, {
                              bartender: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                        >
                          <option value="">Select Bartender</option>
                          {staff
                            .filter((s) => s.role === "Bartender")
                            .map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        {selectedOrder.status !== "Ready" &&
                          selectedOrder.status !== "Served" &&
                          selectedOrder.status !== "Paid" && (
                            <button
                              onClick={() =>
                                updateOrder(selectedOrder.id, { status: "Ready" })
                              }
                              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                              Mark as Ready
                            </button>
                          )}

                        {selectedOrder.status !== "Served" &&
                          selectedOrder.status !== "Paid" && (
                            <button
                              onClick={() =>
                                updateOrder(selectedOrder.id, { status: "Served" })
                              }
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
                          <p className="mt-1 text-amber-300">
                            Rating: {"★".repeat(selectedOrder.rating)}
                          </p>
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
            )}
          </div>
        )}
      </main>

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0D0D0D] p-6">
            <h3 className="mb-4 text-lg font-medium">Rate your experience</h3>

            <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all ${
                    star <= rating ? "text-amber-400" : "text-white/20"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Tell us what went wrong (optional)..."
              className="mb-6 h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowComplaintForm(false);
                  setRating(0);
                  setComplaintText("");
                }}
                className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => submitComplaint(selectedOrderId)}
                className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Cart */}
      {role === "customer" && cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:hidden">
          <button
            onClick={placeOrder}
            className="flex items-center gap-3 rounded-full bg-amber-500 px-5 py-3.5 font-semibold text-black shadow-2xl shadow-amber-500/30 transition-all hover:scale-[1.02]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-amber-400">
              {cartCount}
            </span>
            <span>Place Order</span>
            <span className="opacity-80">₦{cartTotal.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;