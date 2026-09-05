
const API = "http://localhost:5000";

export const fetchMenu = async () =>
  (await fetch(`${API}/menu`)).json();

export const fetchStaff = async () =>
  (await fetch(`${API}/staff`)).json();

export const fetchOrders = async () =>
  (await fetch(`${API}/orders`)).json();

export const createOrder = async (order) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  return res.json();
};

export const updateOrder = async (id, updates) => {
  const res = await fetch(`${API}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  return res.json();
};