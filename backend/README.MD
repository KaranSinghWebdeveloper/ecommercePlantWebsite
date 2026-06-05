# 🌿 Plant Store Backend

This is the backend API server for the **Plant Store Ecommerce Platform**, built using **Node.js** and **Express.js**.

Handles authentication, products, categories, orders, payments, inventory, and business logic.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- PostgreSQL / MySQL
- Prisma ORM
- JWT Authentication
- Cloudinary
- Razorpay
- Stripe

---

## 🌱 Features

### Authentication

- Register
- Login
- Logout
- JWT Authentication

### Product Management

- Add products
- Update products
- Delete products
- Product categories
- Product search

### Order Management

- Create orders
- Update order status
- Order history
- Invoice generation

### Payment

- Razorpay integration
- Stripe integration
- Payment verification

### Inventory

- Stock management
- Low stock alert

---

## 📁 Folder Structure

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
│
├── uploads/
│
└── package.json
```

---

## ⚙️ Installation

### Install Dependencies

```bash
npm install
```

---

### Run Development Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 🔐 Environment Variables

Create `.env`

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

---

## 📦 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Products

```http
GET /api/products
GET /api/products/:slug
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Categories

```http
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

### Orders

```http
POST /api/orders
GET /api/orders/user
PUT /api/orders/:id
```

### Payment

```http
POST /api/payment/create-order
POST /api/payment/verify
```

---

## 🏗 Build Project

```bash
npm run build
```

---

## 🚀 Production Start

```bash
npm start
```

---

## 🌍 Deployment

Recommended:

- VPS
- Railway
- Render
- AWS

---

## 👨‍💻 Developer

### Karan Singh

Software Developer | MERN Stack | Laravel | Next.js | Node.js