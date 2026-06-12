# 🍕 CRUSTIVA

### *Premium Pizza Delivery & Live Pizza Customization Platform*

CRUSTIVA is a production-grade, premium full-stack food-tech platform engineered on the MERN stack. Designed with a luxury dark gourmet aesthetic, it features an interactive audio-visual pizza customizer, independent multi-session authentication, real-time stock deduction, secure Razorpay checkout verification, and automated kitchen workflows.

---

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

---

## 📖 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Demo Flow](#-demo-flow)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [MongoDB Atlas Setup](#-mongodb-atlas-setup)
- [Authentication](#-authentication)
- [Razorpay Setup](#-razorpay-setup)
- [Admin Panel](#-admin-panel)
- [Pizza Customizer](#-pizza-customizer)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Git Workflow](#-git-workflow)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🌟 Features

### 👤 Customer Experience
* **Secure Auth Gateway:** Register, login, forgot password token flows, and strict email verification services.
* **Luxury Catalog:** Real-time recipe browsing, full-text searches, and category-filtered pizza grids.
* **Live Pizza Customizer:** Dynamic 3D-layered canvas, audio synthesizer pops, custom crust/sauce/cheese picks, and smart collision-avoiding topping scatter.
* **Secure Checkout:** Premium cart overlays, shipping address registry, and standard Razorpay checkout.
* **Live Order Stepper:** Real-time preparation polling steps (*Order Received ➡️ In Kitchen ➡️ Sent to Delivery ➡️ Delivered*).

### 👑 Admin Console
* **Analytics Dashboard:** Financial reporting charts (daily revenue trends), order fulfillment rates, and low-stock alerts.
* **Gourmet Pizza Menu Management:** Direct CRUD controls to add new recipes, adjust pricing, edit details, and set availability status (*Available*, *Temporarily Hidden*, *Out Of Stock*).
* **Inventory Stock Control:** Track individual ingredient items, safety threshold levels, and trigger alerts.
* **Order Pipeline Manager:** Update preparation states on live kitchen orders.
* **User Accounts Log:** Audit user roles and permissions.

---

## 📸 Screenshots & Video Demos

Here is a visual showcase of the **CRUSTIVA Dark Gourmet Theme**, interactive customizer, and backend management interfaces.

### 🎥 Live Pizza Customizer Video Demo
*A video walkthrough demonstrating dynamic size configurations, crust base changes, white sauce spread transition, topping drop animations, and realistic visual layer placement.*

<video src="docs/screenshots/pizza_customizer_demo.webm" width="100%" autoplay loop muted playsinline></video>

### Landing Page & Hero Section
*A floating glassmorphic hero deck welcomes users with smooth Framer Motion transitions.*
![Crustiva Home Gourmet Hero](docs/screenshots/hero_section.png)

### Gourmet Recipe Grid
*Hover-active cards displaying review metrics, preparation times, and active ingredient status.*
![Crustiva Gourmet Cards](docs/screenshots/gourmet_cards.png)

### Layered Sourdough Pizza Customizer
*A fully animated virtual builder with interactive visual toppings scatter.*
![Interactive Pizza Customizer](docs/screenshots/pizza_customizer.png)
![Interactive Alfredo Pizza Builder](docs/screenshots/pizza_customizer_alfredo.png)

### Cart Page & Checkout Details
*Premium cart overlay displaying itemized basket, selected base crust/sauces/toppings, and contact checkout details.*
![Crustiva Cart Page](docs/screenshots/cart_page.png)

### Live Order Tracker
*Real-time stepper showing preparation states in the kitchen.*
![Crustiva Order Tracker](docs/screenshots/order_tracker.png)

### Admin Console & Analytics Dashboard
*SVG charts displaying financial analytics, kitchen statuses, and low-stock inventory alerts.*
![Crustiva Admin Dashboard](docs/screenshots/admin_dashboard.png)

### Inventory Stock Management
*Track individual ingredient stock levels, unit pricing, and thresholds.*
![Crustiva Admin Inventory](docs/screenshots/admin_inventory.png)

### Gourmet Pizza Menu CRUD
*Full CRUD controls to add, adjust prices, edit details, and hide/show recipes.*
![Crustiva Admin Menu](docs/screenshots/admin_menu.png)

---

## 🏃 Demo Flow

To experience the platform's features, follow this flow:
1. **Explore as Guest:** Browse the landing page, catalog cards, and launch the customizer.
2. **Register & Verify:** Create a user account. Email verification defaults to server console fallback loggers.
3. **Login as Customer:** Connect using seeded credentials (`user@crustiva.com` / `userpassword123`).
4. **Customize & Cart:** Select *Thin Crust*, *Basil Pesto*, *Mozzarella*, scatter *Mushrooms* and *Sweet Corn*, and add it to the cart.
5. **Checkout & Mock Pay:** Place a mock transaction using the Razorpay Standard Checkout Test modal (Netbanking -> Success).
6. **Order Stepper:** Check your order status update in real-time as a stepper progress tracker.
7. **Login as Admin:** Connect using admin credentials (`admin@crustiva.com` / `adminpassword123`).
8. **Manage Shop:** View daily revenue graphs, update order kitchen steps, replenish toppings inventory, and modify pizza menu statuses.

---

## 💻 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite | Core view layer with fast hot module reloading. |
| **Styling** | Tailwind CSS | Utility-first design tokens and responsive grid configurations. |
| **Animation** | Framer Motion | Smooth entry, customizer fly-in drops, and slide transitions. |
| **Backend** | Node.js, Express.js | Structured REST API service routing. |
| **Database** | MongoDB, Mongoose | NoSQL database layer with transaction-like schema models. |
| **Payments** | Razorpay SDK | Client standard checkout checkout popup and HMAC signature verification. |
| **Security** | JWT, bcryptjs | Stateless authorization tokens and salted passwords hashing. |
| **Mailing** | Resend SDK | Dispatch transactional emails for verified receipts (with console log fallbacks). |

---

## 📂 Folder Structure

```text
Pizza Delivery Application/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── assets/             # Images, logos, and raw visual assets
│   │   ├── components/         # Global Shared components (Navbar, Route Guards)
│   │   ├── context/            # React Context Providers (Auth, Cart)
│   │   ├── pages/              # Routing views (Home, Customizer, Cart, Tracker)
│   │   │   └── admin/          # Administrative Console views (Dashboard, Menu, Inventory, Orders)
│   │   ├── services/           # Axios HTTP request instances
│   │   ├── App.jsx             # Main Router structure
│   │   └── main.jsx            # Application entry mount point
│   ├── index.html              # Main HTML container
│   └── vite.config.js          # Vite server and proxy configuration
├── server/                     # Backend API Service
│   ├── src/
│   │   ├── config/             # Third-party service configurations (MongoDB, dbSeeder)
│   │   ├── controllers/        # Request controllers (Auth, Payments, Pizzas, Inventory, Orders)
│   │   ├── middleware/         # Security validation and role checks
│   │   ├── models/             # Mongoose DB schema definitions (User, Pizza, Inventory, Order)
│   │   ├── routes/             # REST route bindings
│   │   └── server.js           # Server initializer and listener entry
│   ├── .env.example            # Environment variables placeholder
│   └── package.json            # Server dependencies and scripts
└── package.json                # Workspace root script orchestration
```

---

## 🛠️ Installation

### Prerequisites
* **Node.js** (v18+)
* **MongoDB** (running locally on port 27017 or a MongoDB Atlas cloud URI)

### How to Open & Run the Project

#### Step 1: Clone the Repository
```bash
git clone https://github.com/TheNameIsVishvesh/mern-pizza-delivery-app.git
cd mern-pizza-delivery-app
```

#### Step 2: Open Terminal in Project Root & Install Root Packages
```bash
npm install
```

#### Step 3: Install All Workspace Packages (Client & Server)
```bash
npm run install-all
```

#### Step 4: Configure Local Environment Variables
Create the backend `.env` configuration file:
```bash
cd server
cp .env.example .env
```
*(Configure local keys inside `server/.env` using the details in [Environment Variables](#-environment-variables))*

#### Step 5: Start All Development Servers Concurrently
Navigate back to the project root and launch:
```bash
cd ..
npm run dev
```

* **Frontend UI:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000`

---

## 🔑 Environment Variables

### Client Setup (No variables required for development)
Vite dev server proxies all `/api/*` endpoints to the backend on `http://localhost:5000` automatically.

### Server Setup (`server/.env`)
Create `server/.env` and configure:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/Crustiva?appName=TrimTechCluster
JWT_SECRET=local_pizza_development_secret_key_change_me
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_placeholder
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
```

---

# 🌐 MongoDB Atlas Setup

This project is configured to run with **MongoDB Atlas** for its cloud database. The data from the local `pizza_db` database has been fully migrated to the `Crustiva` database on MongoDB Atlas.

### 🔌 Atlas Connection Instructions

1. Log in to your MongoDB Atlas Account.
2. Under your project, click **Database** and then click **Connect** for your cluster.
3. Choose **Drivers** under connection methods.
4. Copy the connection string and ensure the database name path is set to `Crustiva` (e.g. `...mongodb.net/Crustiva?...`).

### 🔑 Environment Variables
Update your `server/.env` file to use the Atlas connection string:
```env
MONGO_URI=mongodb+srv://trimtechUser:Trimtech%40123@trimtechcluster.mxfrdpz.mongodb.net/Crustiva?appName=TrimTechCluster
```
*Do not commit your connection credentials to git. Keep them strictly inside `server/.env`.*

### 📦 Migration Notes
The migration from the local database `pizza_db` to MongoDB Atlas was completed using custom utility scripts. The migration:
* Preserved all MongoDB `ObjectId`s to keep data integrity.
* Preserved `createdAt` and `updatedAt` timestamps.
* Preserved relationships and references between collections.
* Recreated all database indexes (unique and query indexes) on the Atlas cluster.

### 💾 Backup Location
The backup of the local MongoDB database is stored in:
`pizza_db_backup/` in the workspace root.
It contains the following EJSON files (which preserve MongoDB BSON types):
* `users.json`
* `pizzas.json`
* `inventories.json`
* `orders.json`

### 🔄 Reseeding Instructions
To perform a clean restore/migration of the backup database to MongoDB Atlas at any time:
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Run the migration script:
   ```bash
   node migrate.js
   ```
This will read the backups from `pizza_db_backup` and overwrite the target collections in MongoDB Atlas, verifying counts automatically.

---

## 🔐 Authentication & Session Isolation

### Role-Based Access Control
The application operates on strict JSON Web Tokens (JWT) transmitted as HTTP `Authorization: Bearer <token>` request headers:
* **Customer Session:** Checked by `protect` middleware to ensure valid user account status.
* **Admin Session:** Checked by `protect` and `authorize('admin')` middlewares, locking down CRUD endpoints.

### Independent Coexisting Sessions
Admin and Customer credentials are saved in entirely independent states:
* **Customer:** Token saved in `slice_customer_token` and profile details in `slice_customer_user`.
* **Admin:** Token saved in `slice_admin_token` and profile details in `slice_admin_user`.
This isolation enables administrators to login to the backend dashboard in one tab, open customer ordering catalogs in another tab, and navigate both simultaneously without session conflicts.

---

## 💳 Razorpay Setup

1. Sign up on [Razorpay](https://razorpay.com) and retrieve your API Keys from **Settings ➡️ API Keys** in your dashboard.
2. Select **Test Mode** (ideal for simulating sandboxed sandbox transactions).
3. Place these keys in your `server/.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
4. **Checkout Simulation:** Card transaction checkout is mocked dynamically in Test Mode. Choose **Netbanking** (any bank -> Success) or use dummy numbers:
   * *Card Number:* `4111 1111 1111 1111`
   * *CVV / OTP:* `123` / `12345`
5. **Cryptographic Validation:** When transactions complete, the client sends signature hashes to the backend. The server validates them using HMAC SHA-256 before deducting stocks and confirming the purchase.

---

## 👑 Admin Panel

The Admin Console contains dedicated subviews:
1. **Analytics Dashboard:** Daily revenue timeline plotted using SVG charts, live kitchen stepper stage counts, and low-stock alerts.
2. **Gourmet Pizza Menu:** Complete CRUD control panel for creating, editing, and deleting pizzas.
3. **Pizza Status Controls:** Drops status states per pizza:
   * 🟢 **Available:** Visible on home pages, customizable, and orderable.
   * 🟡 **Temporarily Hidden:** Omitted from customer queries, still fully manageable in admin views.
   * 🔴 **Out of Stock:** Visible to customers with a "Currently Unavailable" badge. Customize/Quick Add/Buy options are fully disabled.

---

## 🍕 Pizza Customizer

The visual builder features a dynamic rendering canvas:
* **Layered Rendering:** Composites base crusts, custom sauces spreads, melted cheese types, and veggie/meat scattered icons above each other.
* **Dynamic Placement Generator:** Programmatically calculates coordinates using a deterministic LCG PRNG. It runs a distance-based collision detection grid to avoid toppings piling up or getting buried.
* **Topping Densities:** Spreads toppings realistically based on pizza size:
  * **Olives / Pepperoni / Chicken:** 10–18 slices
  * **Sweet Corn Kernels:** 20–35 pieces
  * **Capsicum / Onions:** 12–20 slices
* **Cheese Opacity Sync:** Reduces the melted cheese layer's opacity slightly as topping counts increase (100% ➡️ 90% ➡️ 82%), keeping ingredients visually dominant.
* **Bounce-Bounce Physics:** Framer Motion spring configurations simulate realistic drops and bounces as toppings settle onto the pizza dough.

---

## 📡 API Endpoints

### 🔐 Auth API (`/api/auth`)
* `POST /api/auth/register` - Create a customer profile.
* `POST /api/auth/login` - Authenticate credentials and sign JWT.
* `GET /api/auth/me` - Fetch profile metadata (Bearer token required).
* `GET /api/auth/verify/:token` - Verify customer email address.
* `POST /api/auth/forgot-password` - Request password reset token.
* `POST /api/auth/reset-password/:token` - Overwrite password using reset token.

### 🍕 Pizza API (`/api/pizzas`)
* `GET /api/pizzas` - Retrieves pizzas (Customers see available/out_of_stock; Admins see all).
* `GET /api/pizzas/customizer-options` - Fetches ingredient items and prices from Inventory.
* `POST /api/pizzas` - Admin: Create new pizza recipe.
* `PUT /api/pizzas/:id` - Admin: Update details, price, category, status.
* `DELETE /api/pizzas/:id` - Admin: Delete pizza recipe.

### 📦 Inventory API (`/api/inventory`)
* `GET /api/inventory` - Get all stock ingredient thresholds.
* `POST /api/inventory` - Admin: Add new customizer ingredient.
* `PUT /api/inventory/:id` - Admin: Update stock level, unit price, threshold.
* `DELETE /api/inventory/:id` - Admin: Delete ingredient.
* `POST /api/inventory/reseed` - Admin: Reseed defaults.

### 💳 Payments API (`/api/payments`)
* `POST /api/payments/create-order` - Recalculate price in backend and create Razorpay transaction.
* `POST /api/payments/verify` - Cryptographically verify signature, deduct inventory stocks, and create order receipt.

### 📋 Orders API (`/api/orders`)
* `GET /api/orders` - Get orders (Customers get personal logs; Admins get all logs).
* `PUT /api/orders/:id/status` - Admin: Update kitchen stepper status.

---

## 🧪 Testing

Confirm the application's stability:

### 1. Backend Syntax Checks
Run Node dry-run parsing on controllers and seeders:
```bash
node --check src/controllers/pizzaController.js
node --check src/config/dbSeeder.js
```

### 2. Frontend Production Bundling
Ensure the React components compile with zero errors:
```bash
cd client
npm run build
```
*Expected Results: Zero errors, zero warnings. Production bundle successfully created in `dist`.*

---

## ☁️ Deployment

### Frontend (Vercel)
1. Add client directory. Vercel automatically maps routing through `client/vercel.json` to avoid SPA 404s.
2. Build Settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`

### Backend (Render)
1. Connect `server` directory as a Web Service.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add backend environment variables defined in server `.env`.

### Database (MongoDB Atlas)
1. Create a free shared cluster.
2. Add network whitelist credentials and fetch the Connection URI.
3. Configure `MONGO_URI` in Render/Vercel environment variables.

---

## 🔱 Git Workflow

We adhere to a strict trunk-based git schema.
```mermaid
graph TD
    main[main - Stable Production]
    develop[develop - QA Integration]
    feature[feature/* - Developer Workspaces]

    develop -->|Pull Request & Review| main
    feature -->|Pull Request & CI checks| develop
```

### Typical Workflow
1. Pull latest code from `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create feature branch:
   ```bash
   git checkout -b feature/dynamic-scattering
   ```
3. Commit semantic changes:
   ```bash
   git add .
   git commit -m "feat(customizer): integrate deterministic LCG placement generator"
   ```
4. Push and create PR to merge into `main`:
   ```bash
   git push origin feature/dynamic-scattering
   ```

---

## ⚠️ Troubleshooting

### Port 5000 In Use
If the backend fails to boot with `EADDRINUSE: :::5000`:
* **Windows (PowerShell):**
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```
* **macOS / Linux:**
  ```bash
  kill -9 $(lsof -t -i:5000)
  ```

### Vite Dev Proxy Errors
If the frontend cannot communicate with the backend:
1. Ensure the Express server is running on port `5000`.
2. Check `client/vite.config.js` to ensure the proxy targets `http://localhost:5000`.
3. Restart Vite: `Ctrl + C` then `npm run dev`.

---

## 🔮 Future Improvements
* **WebSocket Integration:** Transition from polling to live socket listeners for kitchen status updates.
* **Apple & Google Pay:** Expand payment integrations using Razorpay Smart Collect.
* **PWA Capability:** Cash assets locally to allow offline menu browsing.

---

## 👥 Contributors
* **Vishvesh Joshi** — *Principal Software Architect & MERN Developer*

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
