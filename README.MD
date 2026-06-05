# 🌿 Plant Store Ecommerce Website

A modern, fast, scalable, and SEO-friendly ecommerce platform for selling **Indoor & Outdoor Plants Online**, built using **Next.js** for frontend and **Node.js/Express.js** for backend APIs.

Designed to provide a smooth shopping experience with high performance, scalability, and search engine optimization.

---

## 🚀 Tech Stack

### Frontend
- **Next.js** (SEO & Performance)
- **React.js**
- **Tailwind CSS**
- **Axios**
- **Redux Toolkit / Context API**
- **Swiper.js / Carousel**

### Backend
- **Node.js**
- **Express.js**
- **JWT Authentication**
- **REST APIs**

### Database
- **PostgreSQL / MySQL**

### Storage
- **Cloudinary** (Plant Image Storage)

### Payment Gateway
- **Razorpay**
- **Stripe**

### Hosting
- **Frontend:** Vercel
- **Backend:** VPS / Railway / Render

---

# 🌱 Features

## Customer Features

### Home Page
- SEO optimized homepage
- Featured plant collections
- Category-wise plant listing
- Hero banners & promotions
- Trending and latest plants

### Product Management
- Indoor Plants
- Outdoor Plants
- Plant categories
- Product filtering
- Product search
- Detailed product pages
- Multiple product images
- Related products

### Shopping Features
- Add to Cart
- Buy Now
- Wishlist
- Quantity update
- Secure checkout process

### User Authentication
- Login
- Registration
- Forgot password
- JWT Authentication

### Order Management
- Order history
- Live order tracking
- Invoice details
- Order status

### Payment Features
- Razorpay integration
- Stripe integration
- Cash on Delivery (COD)

### Delivery Features
- Delivery charge based on location
- Delivery tracking
- Estimated delivery time

### SEO Features
- Dynamic meta titles
- Meta descriptions
- Open Graph tags
- Sitemap generation
- SEO-friendly URLs

Example:

```txt
/plants/indoor-money-plant
```

---

# 🛠 Admin Panel Features

### Dashboard
- Sales overview
- Revenue analytics
- Product statistics
- Orders summary

### Product Management
- Add products
- Edit products
- Delete products
- Upload multiple images
- Manage stock

### Category Management
- Create categories
- Update categories
- Delete categories

### Order Management
- View all orders
- Update order status
- Delivery tracking
- Invoice management

### Customer Management
- Customer details
- Purchase history

### Coupons & Discounts
- Discount management
- Promo codes

---

# 📁 Project Structure

```txt
plant-ecommerce/
│
├── frontend/                 # Next.js Frontend
│
├── backend/                  # Node.js Backend
│
├── README.md
│
└── .gitignore
```

---

## Frontend Structure

```txt
frontend/
│
├── app/
│   ├── page.jsx
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   └── profile/
│
├── components/
├── redux/
├── services/
├── hooks/
├── utils/
├── public/
└── styles/
```

---

## Backend Structure

```txt
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── prisma/
└── package.json
```

---

# 🔐 Environment Variables

Create `.env` file in backend:

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

FRONTEND_URL=http://localhost:3000
```

Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/plant-store.git
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend Runs On:

```txt
http://localhost:3000
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend Runs On:

```txt
http://localhost:5000
```

---

# 📦 API Structure

## Product APIs

```http
GET /api/products
GET /api/products/:slug
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

## Order APIs

```http
POST /api/orders
GET /api/orders/user
```

## Payment APIs

```http
POST /api/payment/create-order
POST /api/payment/verify
```

---

# 🎯 Future Improvements

- AI plant recommendation
- Plant care guide
- Subscription plans
- Real-time delivery tracking
- WhatsApp order integration
- Multi-vendor support
- Mobile application

---

# 👨‍💻 Developer

### Karan Singh

**Software Developer | Laravel | MERN Stack | Next.js | Node.js**

Focused on building scalable software solutions and ecommerce platforms.

---

# 📄 License

This project is licensed for private use.

© 2026 Karan Singh. All Rights Reserved.