# ChronoAdmin — Smartwatch E-Commerce Admin Panel

A modern, dark-themed admin dashboard for a smartwatch e-commerce website, built with **React 18 + Vite + TailwindCSS**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
smartwatch-admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Wrapper with Sidebar + Topbar
│   │   ├── Sidebar.jsx       # Collapsible navigation sidebar
│   │   └── Topbar.jsx        # Header with search + notifications
│   ├── context/
│   │   └── AdminContext.jsx  # Global state management
│   ├── data/
│   │   └── mockData.js       # All mock data (products, orders, users, etc.)
│   ├── pages/
│   │   ├── Dashboard.jsx     # Overview with charts & stats
│   │   ├── Products.jsx      # Product management (CRUD)
│   │   ├── Orders.jsx        # Order management + status update
│   │   ├── Users.jsx         # Simplified user management
│   │   ├── Coupons.jsx       # Coupon management
│   │   ├── Analytics.jsx     # Charts & analytics
│   │   └── Settings.jsx      # Admin settings
│   ├── App.jsx               # Routes
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ✨ Features

| Page | Features |
|------|----------|
| **Dashboard** | Stats cards, revenue chart, category pie, recent orders, activity feed |
| **Products** | Table view, search/filter, add/edit/delete product modals |
| **Orders** | Status tabs, search, view order details, update order status |
| **Users** | Card grid, search/filter, block/unblock users *(simplified as requested)* |
| **Coupons** | Coupon cards, usage progress, create/delete coupons, copy code |
| **Analytics** | Revenue/orders charts, category distribution, top products |
| **Settings** | Store config, notifications toggles, security, maintenance mode |

---

## 🎨 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **TailwindCSS 3** — Utility-first styling
- **Recharts** — Charts & data visualization
- **Lucide React** — Icon library
- **Vite** — Build tool

---

## 🔗 Integrating with Your Smartwatch E-Commerce Site

This admin panel is designed as a **standalone frontend module**. To integrate:

1. Copy this folder into your main project
2. Replace mock data in `src/data/mockData.js` with your actual API calls
3. Add authentication guard (redirect to login if no admin token)
4. Link the admin panel from your main site's header/footer

---

## 📝 Notes

- All data is **mock/frontend only** — no backend required
- State is managed via React Context (`AdminContext`)
- To connect a real API, replace data in `mockData.js` and update `AdminContext.jsx` with fetch calls
