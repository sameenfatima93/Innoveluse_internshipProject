# ⌚ ChronoStore — Smart Watch E-Commerce (React)

## 🚀 Setup

```bash
cd chrono-store
npm install
npm start
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── HomePage.jsx          ← Main store page
│   └── ProductDetailPage.jsx ← Product detail page
├── components/
│   ├── Navbar.jsx            ← Top navigation (on all pages)
│   ├── Footer.jsx            ← Footer (on all pages)
│   ├── Hero.jsx              ← Landing hero section
│   ├── ProductCard.jsx       ← Card with Buy + Add to Cart
│   ├── Cart.jsx              ← Sliding cart drawer
│   ├── Breadcrumb.jsx        ← Home > Products > Name
│   ├── StarRating.jsx        ← Star rating display
│   └── Loader.jsx            ← Loading spinner
├── hooks/
│   └── useProducts.js        ← Fetches from MockAPI
├── data/
│   └── products.js           ← Category labels only
└── styles/
    ├── global.css
    ├── Navbar.css
    ├── Hero.css
    ├── ProductCard.css
    ├── Cart.css
    ├── ProductDetail.css
    ├── Breadcrumb.css
    └── App.css
```

---

## ✏️ HOW TO CUSTOMIZE

### 1. Change Website Name / Logo
Open `src/components/Navbar.jsx`:
```jsx
<span className="navbar__logo-icon">⌚</span>   {/* Change emoji or use <img> */}
<span className="navbar__logo-text">ChronoStore</span>  {/* Change name */}
```
Also update `src/components/Footer.jsx` and `src/components/Hero.jsx`.

---

### 2. Change Product Images
In MockAPI, add an `image` field with a direct image URL:
```json
{
  "name": "Galaxy Watch Ultra",
  "image": "https://example.com/galaxy-watch.png",
  ...
}
```
The site automatically shows the real image if the `image` field exists.
Otherwise it shows a ⌚ emoji placeholder.

**Recommended free image hosts:**
- https://imgbb.com  (upload your own)
- https://cloudinary.com  (free tier)
- Any direct image URL (ending in .jpg, .png, .webp)

---

### 3. Add More Products
Go to MockAPI → your project → product → Data → add new entries:
```json
{
  "name": "Your Watch Name",
  "brand": "Brand Name",
  "price": 25000,
  "oldPrice": 30000,
  "category": "fitness",
  "badge": "new",
  "rating": 4.5,
  "image": "https://your-image-url.com/watch.jpg",
  "color": "#1a1a2e",
  "accent": "#4f8ef7",
  "description": "Short product description here.",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
}
```
**Categories:** `fitness` | `luxury` | `budget`
**Badges:** `new` | `hot` | `""` (empty = no badge)

---

### 4. Change Colors / Theme
Open `src/styles/global.css` and `src/styles/ProductDetail.css`.
Main accent color is `#4f8ef7` (blue) — search and replace to change.

---

## ✨ Features
- ✅ English content throughout
- ✅ Two buttons per card: Buy Now + Add to Cart
- ✅ Click anywhere on card → Product Detail Page
- ✅ Product Detail Page with large image
- ✅ Breadcrumb navigation (Home > Products > Name)
- ✅ Customer reviews with star ratings
- ✅ Navbar + Footer on all pages
- ✅ MockAPI integration
- ✅ Search, filter, sort
- ✅ Responsive (mobile friendly)
