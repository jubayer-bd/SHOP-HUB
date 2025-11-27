# E-Commerce Website (Next.js + Node.js + MongoDB)

A modern, responsive full-stack e-commerce application built using Next.js on the frontend and Express.js + MongoDB on the backend. Includes authentication, cart, wishlist, dynamic product pages, and polished UI.

---

## 📌 Project Description

This project is a fully functional e-commerce platform featuring:

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- NextAuth Authentication (Email/Google)
- React Context API
- Optimized images and dynamic routing

### Backend
- Node.js + Express.js
- MongoDB Database
- REST API (Products, Wishlist, Cart)

### Key Features
- User Login & Registration with NextAuth
- Secure protected routes
- Product listing & dynamic product details
- Add to Cart, Update Quantity, Remove from Cart
- Wishlist management
- Toast notifications (react-hot-toast)
- Fully responsive modern UI

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-user/your-repository.git
cd your-repository
```

---

## 🖥 Frontend Setup (Next.js)

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create Environment File
Create a file named **.env.local**:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

BACKEND_URL=https://e-comerce-server.vercel.app
```

---

### 4️⃣ Run Frontend Development Server
```bash
npm run dev
```
Local server: http://localhost:3000

---

## 🖥 Backend Setup (Optional if hosted)
```bash
cd server
npm install
npm run dev
```

---

## 🧭 Routes Overview

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/products` | Product listing |
| `/products/[id]` | Product details |
| `/login` | User login |
| `/register` | User registration |

---

### Private Routes (Authentication Required)
| Route | Description |
|-------|-------------|
| `/wishlist` | User wishlist |
| `/cart` | User shopping cart |
| `/profile` | User profile (optional) |

---

## 🗂 Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get a single product |
| GET | `/wishlist?email=` | Get wishlist items |
| POST | `/wishlist` | Add item to wishlist |
| DELETE | `/wishlist/:id` | Remove wishlist item |
| GET | `/cart?email=` | Get cart items |
| POST | `/cart` | Update cart quantity |
| DELETE | `/cart/:id` | Remove item from cart |

---

## 📸 Screenshots (Optional)
_Add your screenshots here._

---

## 📄 License
This project is open-source and free to use.

