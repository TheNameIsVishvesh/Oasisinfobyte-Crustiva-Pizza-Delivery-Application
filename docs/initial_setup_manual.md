# 📘 MERN Stack Initial Project Setup Manual

This guide documents the complete initial setup steps for our professional **Pizza Delivery Application** (MERN Stack).

---

## 📋 Step 1 — Verify Required Software

Confirm your system meets development requirements:

### Verification Commands
```bash
# 1. Node.js Verification
node -v
# Expected: v18.x.x or newer (e.g., v22.17.0)

# 2. npm Verification
npm -v
# Expected: v9.x.x or newer (e.g., v10.9.2)

# 3. Git Verification
git --version
# Expected: git version 2.x.x
```

### Troubleshooting
* **Command not found:** The software is not installed, or its path is not set in environment variables.
* **How to Install:**
  * **Node.js & npm:** Download the LTS installer from [nodejs.org](https://nodejs.org/). This installs both Node.js and `npm` concurrently.
  * **Git:** Download the installer from [git-scm.com](https://git-scm.com/). During installation, keep default settings, ensuring Git is added to the system PATH.

---

## 💻 Step 2 — VS Code Setup

To enforce consistent formatting rules across the workspace, we have seeded recommended setups in `.vscode/`.

### Recommended Extensions
The editor will suggest the following extensions upon opening:
1. **ESLint** (`dbaeumer.vscode-eslint`) — Real-time JavaScript code quality and error detection.
2. **Prettier - Code Formatter** (`esbenp.prettier-vscode`) — Automatically styles files to maintain strict spacing.
3. **Tailwind CSS IntelliSense** (`bradlc.tailwindcss-intellisense`) — Provides autocomplete suggestions for styling classes.
4. **Thunder Client** (`rangav.vscode-thunder-client`) — Built-in visual tool to test REST API routes (similar to Postman).
5. **GitLens** (`eamodio.gitlens`) — Rich inline Git blames and branch history visualization.

### Installation Instructions
1. Open VS Code.
2. Press `Ctrl + Shift + X` (or `Cmd + Shift + X` on macOS) to open the Extensions view.
3. Search for the recommended extension IDs listed above and click **Install**.
4. Standard configurations (Format on Save, 2 spaces tab width) are automatically activated by `.vscode/settings.json`.

---

## 🔗 Step 3 — Git Clone & Project Setup

To clone and initialize the local folder structure, run these commands:

```bash
# Clone the repository
git clone https://github.com/mern-pizza-delivery-app.git "Pizza Delivery Application"

# Open in VS Code
code "Pizza Delivery Application"
```

---

## 🔱 Step 4 — Branch Workflow

We implement a trunk-based branching model to ensure production stability.

### Git Branching Setup Commands
```bash
# 1. Ensure you are on the primary branch
git checkout main

# 2. Pull latest upstream commits
git pull origin main

# 3. Create the integration branch 'develop'
git checkout -b develop

# 4. For future features, fork off 'develop'
git checkout -b feature/your-feature-name develop
```

---

## 📂 Step 5 — Folder Structure

We use an industry-standard, decoupled layout to divide public-facing clients from database processes.

### Terminal Commands to Recreate (if needed)
```bash
# Frontend Subfolders
mkdir -p client/src/{assets,components,context,hooks,pages,router,services,utils}

# Backend Subfolders
mkdir -p server/src/{config,controllers,middleware,models,routes,utils}

# Docs Subfolder
mkdir -p docs
```

---

## 🎨 Step 6 — Frontend Setup

The frontend uses Vite (React + JS), Tailwind CSS, React Router v6, Axios, and Lucide React.

### Installation Commands
```bash
# Navigate to frontend folder
cd client

# Install main packages
npm install react-router-dom axios lucide-react

# Install styling dependencies
npm install -D tailwindcss postcss autoprefixer
```

### Config Files Created
* `client/vite.config.js` — Custom local server mapping reverse-proxy routes.
* `client/tailwind.config.js` — Seeded custom color tokens (e.g. `pizza-primary`).
* `client/postcss.config.js` — Autoprefixer CSS module builder.
* `client/src/index.css` — Standard Tailwind layers and premium design helper utilities.

---

## 🔌 Step 7 — Backend Setup

The backend uses Express.js, MongoDB Atlas (via Mongoose), dotenv, cors, nodemon, bcryptjs, jsonwebtoken, Resend, and Razorpay.

### Installation Commands
```bash
# Navigate to backend folder
cd server

# Install core runtime libraries
npm install express cors dotenv mongoose bcryptjs jsonwebtoken resend razorpay

# Install developer file watcher
npm install -D nodemon
```

### Config Files Created
* `server/package.json` — Pre-wired start scripts (`npm run dev` for nodemon).
* `server/src/server.js` — Main Express app with Mongoose connection logic and health checks.

---

## 🚦 Step 8 — Initial Run & Testing

To run both applications concurrently, launch two separate terminal instances:

### 1. Launch backend
```bash
cd server
npm run dev
# Expected output:
# 🍕 Server running in development mode on port 5000
# ✅ Successfully connected to MongoDB Atlas.
```

### 2. Launch frontend
```bash
cd client
npm run dev
# Expected output:
#  VITE v5.x.x  ready in X ms
#  ➜  Local:   http://localhost:5173/
```

### 3. Browser Verification
Open your browser and navigate to:
* **UI Interface:** `http://localhost:5173/`
* **API Health check:** `http://localhost:5173/api/health`

---

## 🔐 Step 9 — Gitignore & Env Setup

### 1. `.gitignore` Rules
To prevent raw passwords, local keys, and heavy build directories from leaking to GitHub, we have configured `.gitignore` at the root folder:
* Ignores `node_modules/` in all folders
* Ignores `dist/` and `build/` compilations
* Ignores `.env` and `*.env` secrets files

### 2. Environment Templates
* **Frontend:** Managed internally via Vite config proxy.
* **Backend:** Seeded in `server/.env.example`.
  To deploy locally, copy this template to a git-ignored `.env` file:
  ```bash
  cp server/.env.example server/.env
  ```

---

## ✍️ Step 10 — Professional Git Commits

To commit changes in small, logical increments, execute the following semantic commit flow:

```bash
# Commit 1: Core configurations and CI pipelines
git add .gitignore README.md .github/
git commit -m "chore: initialize repository configs and CI workflows"

# Commit 2: Recommended VS Code settings
git add -f .vscode/
git commit -m "chore(vscode): commit recommended workspace settings and extensions"

# Commit 3: Folder Structure
git add "*keep"
git commit -m "style: establish professional scalable folder structure with .gitkeep placeholders"

# Commit 4: Frontend Framework Bootstrap
git add client/package.json client/vite.config.js client/index.html client/src/
git commit -m "feat(client): bootstrap React Vite frontend with Axios and Router"

# Commit 5: Tailwind Styling Configuration
git add client/tailwind.config.js client/postcss.config.js client/src/index.css
git commit -m "feat(client): configure Tailwind CSS with custom premium pizza theme"

# Commit 6: Backend Server Setup
git add server/
git commit -m "feat(server): initialize Express.js backend API with Atlas support and env template"
```

---

## ✅ Step 11 — Final Project Health Check

Use this checklist to verify your foundation setup before coding business features:

- [x] **Git Workspace:** `git status` shows clean branch; remote branch `develop` is locked and synchronized.
- [x] **Code Styling:** VS Code formatting on save is operational; code conforms to ESLint guidelines.
- [x] **Frontend Bundler:** `npm run build` runs and creates `/dist` without CSS compiling errors.
- [x] **Backend Daemon:** Express starts via `nodemon` on Port `5000`.
- [x] **Database Integrations:** Database logs show successful Mongo Atlas connectivity status.
- [x] **API Connectivity:** Browser checks on `http://localhost:5173/api/health` return valid JSON output (proxied seamlessly to server).
- [x] **Security Shield:** Local `.env` secrets file exists locally and is completely hidden from version control checks.
