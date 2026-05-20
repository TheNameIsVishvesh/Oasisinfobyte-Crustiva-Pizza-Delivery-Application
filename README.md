# 🍕 SliceLife | Premium Full-Stack MERN Pizza Delivery Application

A professional, production-grade full-stack Pizza Delivery Application built on the **MERN (MongoDB, Express, React, Node.js)** stack. This project serves as a cornerstone implementation for the **Oasis Infobyte Level 3 Developer Internship**.

---

## 🚀 Technology Stack

### Frontend Architecture
* **Core:** React + Vite (Fast compilation, hot module reloading)
* **Styling:** Tailwind CSS (Modern responsive utility system + premium design tokens)
* **Routing:** React Router v6 (Client-side nested routes and structural shells)
* **HTTP Client:** Axios (Configured with Vite reverse-proxy middleware)
* **Visual Tokens:** Lucide React (Crisp vector icons)

### Backend Architecture
* **Core:** Node.js + Express.js
* **Database:** MongoDB Atlas (Mongoose ODM layer)
* **Security & Auth:** JSON Web Tokens (JWT) + bcryptjs (Hashing & validation)
* **Email System:** Resend API Integration (Order receipt HTML formatting)
* **Payments:** Razorpay Test Mode SDK integration
* **Process Manager:** Nodemon (Hot-reloading daemon for dev)

### Deployment & CI/CD
* **Hosting:** Vercel (Frontend) + Render (Backend Web Service)
* **Pipelines:** GitHub Actions CI (Automated build and dependency checks)

---

## 📂 Repository Structure

```text
Pizza Delivery Application/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions continuous integration pipeline
├── .vscode/
│   ├── extensions.json        # Recommended team extension setups
│   └── settings.json          # Workspace settings & formatting on save
├── docs/                      # Technical specification manuals
├── client/                    # React frontend application
│   ├── src/
│   │   ├── assets/            # Vector graphics, logos, and images
│   │   ├── components/        # Shared components (Buttons, Modals, Cards)
│   │   ├── context/           # React Context state providers (Auth, Cart)
│   │   ├── hooks/             # Custom state hooks
│   │   ├── pages/             # Route pages (Home, Menu, Customizer, Checkout)
│   │   ├── router/            # Custom client router mappings
│   │   ├── services/          # API integration files (Axios client)
│   │   └── utils/             # Helper formatters and math utilities
│   │   ├── App.jsx            # Main app shell & router mapping
│   │   ├── index.css          # Main stylesheet with tailwind injections
│   │   └── main.jsx           # ReactDOM browser mount point
│   ├── index.html             # Entry HTML document with Google Fonts imports
│   ├── postcss.config.js      # PostCSS processor integration
│   ├── tailwind.config.js     # Premium theme & tailwind configuration
│   └── vite.config.js         # Vite configuration with reverse proxy logic
├── server/                    # Express.js backend application
│   ├── src/
│   │   ├── config/            # Third-party setups (DB, Razorpay, Resend)
│   │   ├── controllers/       # Controller handler callbacks
│   │   ├── middleware/        # JWT security & validation middleware
│   │   ├── models/            # MongoDB schema models (User, Order, Pizza)
│   │   ├── routes/            # Express endpoint mappings
│   │   ├── utils/             # Error classes and helper triggers
│   │   └── server.js          # App initialization and listener entry
│   ├── .env                   # Secret environmental keys (Git-ignored)
│   ├── .env.example           # Shared placeholder secrets template
│   └── package.json           # Node engine dependencies & scripts
├── .gitignore                 # Workspace version exclusions list
└── README.md                  # Development manual (This file)
```

---

## 🛠️ Step-by-Step Initial Setup

### 1. Verify Prerequisites
Before initializing the workspace, confirm you have Node.js and Git installed. Run the following in your terminal:
```bash
# Verify Node (v18+ recommended)
node -v

# Verify npm (v9+ recommended)
npm -v

# Verify Git
git --version
```

### 2. Configure Local Environment Files
Ensure keys are set up correctly. Copy backend placeholders:
```bash
cd server
cp .env.example .env
```
Open `server/.env` and update the local connections (e.g., `MONGO_URI`, `JWT_SECRET`).

### 3. Install Dependencies
Run the installation scripts in both workspaces:
```bash
# Install frontend packages
cd client
npm install

# Install backend packages
cd ../server
npm install
```

### 4. Start Development Servers
Start both environments concurrently:
```bash
# Terminal 1: Run the Backend server (listening on port 5000)
cd server
npm run dev

# Terminal 2: Run the Frontend client (listening on port 5173)
cd client
npm run dev
```

### 5. Verification Check
Open your browser and navigate to:
* **Frontend Site:** `http://localhost:5173`
* **Backend Health Route:** `http://localhost:5173/api/health` (automatically proxied directly to port 5000)

If the dashboard displays a green **"Successfully Connected"** badge, your environment is correctly configured!

---

## 🔱 Professional Git Branching Workflow

We adhere to a strict trunk-based git schema.

```mermaid
graph TD
    main[main - Production]
    develop[develop - Integration]
    feature[feature/* - Developer Workspaces]

    develop -->|Pull Request & Review| main
    feature -->|Pull Request & CI checks| develop
```

### Typical Flow:
1. **Pull latest changes:**
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Launch a dedicated feature branch:**
   ```bash
   git checkout -b feature/user-authentication
   ```
3. **Commit work with semantic conventions:**
   ```bash
   git add .
   git commit -m "feat(auth): integrate jwt sign token validation and register controllers"
   ```
4. **Push and create a Pull Request (PR) to `develop`:**
   ```bash
   git push origin feature/user-authentication
   ```

---

## ⚠️ Troubleshooting Guide

### 1. Port 5000 / 5173 Conflicts
If you receive an `EADDRINUSE: address already in use :::5000` error:
* **Windows (PowerShell):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```
* **macOS / Linux:**
  ```bash
  kill -9 $(lsof -t -i:5000)
  ```

### 2. Vite CORS / Proxy Errors
If the health check fails to reach the backend:
1. Double-check that your Express server is actively running on port `5000`.
2. Review `client/vite.config.js` to ensure the proxy block targets `http://localhost:5000` exactly.
3. Restart the Vite developer daemon (`Ctrl + C` then `npm run dev`).
