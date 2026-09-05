# Chowly – Restaurant Ordering System

A full-stack restaurant ordering system built for **The Yellow Chilli (Victoria Island)**.

## Features

* Customer menu with categories
* Live cart
* Order placement
* Order tracking
* Waiter dashboard
* Chef/Bartender assignment
* Complaint & rating
* Payment simulation
* Persistent PostgreSQL storage

## Tech Stack

| Layer      | Technology                  |
| ---------- | ---------------------------- |
| Frontend   | React + Vite + Tailwind CSS |
| Backend    | Express                     |
| ORM        | Prisma                      |
| Database   | PostgreSQL (Neon)           |
| Deployment | Vercel + Render             |

## Architecture

* React frontend
* Express REST API
* Prisma ORM
* Neon PostgreSQL
* Persistent order management

The frontend fetches all data (menu, staff, orders) from the Express API on load and sends every customer/waiter action back to it — nothing is stored locally in the browser. This means orders genuinely persist across refreshes, devices, and sessions, since they live in Postgres rather than in-memory state.

## Data Model

Four Prisma models back the application:

* **MenuItem** — `id`, `name`, `category`, `price`, `prepTime`, `image`, `description`
* **Staff** — `id`, `name`, `role` (`Chef` or `Bartender`)
* **Order** — `id` (internal key), `orderNumber` (human-readable, e.g. `ORD-596146`), `status`, `total`, `waitingTime`, `createdAt`, `chef`, `bartender`, `rating`, `complaint`, `paid`, `paymentRef`
* **OrderItem** — join table linking an `Order` to a `MenuItem`, storing `quantity` and a `price` snapshot at the time of order (so historical orders stay accurate even if menu prices change later)

## API Routes

| Method | Route          | Purpose                                                        |
| ------ | -------------- | ---------------------------------------------------------------- |
| GET    | `/menu`        | Fetch all menu items                                            |
| GET    | `/staff`       | Fetch all staff, optionally filtered by role                    |
| GET    | `/orders`      | Fetch all orders with their items and menu details             |
| POST   | `/orders`      | Place a new order from a cart                                   |
| PATCH  | `/orders/:id`  | Update an order — status, chef/bartender assignment, rating/complaint, or payment |

## Application Behaviour

* **Menu browsing** — a customer opens the app, enters the restaurant, and browses the menu filtered by category (All / Mains / Starters / Drinks), with each dish showing its price and prep time.
* **Order placement** — the customer adjusts quantities with an inline stepper, sees a live running total in the cart, and places the order. On success, they're shown a confirmation screen with the order number, itemized breakdown, total, and estimated wait time (the longest `prepTime` among the ordered items).
* **Order assignment** — every placed order appears on the Waiter Dashboard. The waiter selects an order and assigns a chef and/or bartender from a dropdown, which also advances the order's status.
* **Order tracking** — both the customer's own order history and the waiter's dashboard reflect live status changes (Pending → Preparing → Ready → Served → Paid) as the waiter updates them.
* **Complaint and rating** — from their order history, a customer can leave a star rating and an optional written complaint against any of their orders.
* **Payment** — once an order is marked Served, the customer can trigger a simulated payment, which generates a reference number and marks the order as Paid.

## How to Use (for a first-time visitor)

1. Open the deployed link. You'll land on the restaurant's landing page — click **Enter Restaurant**.
2. You start in **Customer** view. Browse the menu, use the category tabs to filter, and tap **Add to Order** (or the `+`/`−` stepper once an item is added) to build your cart.
3. Your running order appears in the sidebar (desktop) or a floating button at the bottom (mobile). Tap **Place Order** to submit it — you'll see a confirmation screen with your order number and estimated wait.
4. Tap **Back to Menu**, and switch to **Waiter** view using the toggle in the top right.
5. In Waiter view, click any order card to open its detail panel, and assign a Chef and/or Bartender from the dropdowns. Use **Mark as Ready** and **Mark as Served** to progress the order.
6. Switch back to **Customer** view — scroll down to "Your Orders" to see the same order, now reflecting its updated status. Once it's marked Served, a **Pay Now** button appears — tap it to complete the simulated payment.
7. You can also tap **Rate / Submit Complaint** on any order to leave a star rating and comment.

## Known Limitations

* There is no authentication distinguishing a real customer from a real waiter — the Customer/Waiter toggle is open to anyone using the app. In a production version, this would be gated behind staff login.
* The app does not currently track which physical table an order came from — all orders are treated as belonging to one session.

## Demo

Frontend: *(https://chowly-restaurant-ordering-system.vercel.app/)*
Backend: *(https://chowly-backend-wbmg.onrender.com/)*