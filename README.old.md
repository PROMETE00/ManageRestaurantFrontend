# 🍽️ Restaurant Management Frontend

## You can support me at
https://coff.ee/prome

This is the frontend for a restaurant management system.  
It is built using **Next.js**, **React**, and **TailwindCSS**.

## ✅ Features

- 👤 Login and register
- 🧾 View and manage orders (tickets)
- 🍽️ See and edit meals and products
- 🪑 Manage tables individually
- 👨‍🍳 Add new employees (admin only)
- 🔐 Route protection (admin and employee)
- 📊 Admin and employee dashboards
- 📦 Product CRUD (Create, Read, Update, Delete)
- 🧭 Sidebar for admin and another for employees

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **React**
- **TailwindCSS**
- **JavaScript**
- **Context API** (for state and auth management)
- **CSS Modules / Global styles**

## 📁 Project Structure

- `src/app/` – Pages and routes (e.g. `/login`, `/dashboard`, `/mesas/[id]`)
- `src/components/` – Reusable UI components
- `src/components/ui/` – Admin and employee sidebars
- `page.jsx` – Main pages
- `layout.js` – Global layout and auth wrapper
- `globals.css` – Tailwind base styles

## 🚀 How to Run

npm install
npm run dev


🔐 Route Protection

Routes are protected depending on user role:

Admins can access everything (including employee management)

Employees can access only their dashboard, tables, and orders

🎨 UI Screens

Login / Register pages

Dashboard

Table view

Orders view

Products: Add / Edit / List

Admin-only employee management

📫 Author

Made by a systems engineering student for restaurant use.
Easily connect this frontend with a Spring Boot backend API.
