
# Full-Stack E-Commerce Web Application

This project is a full-featured e-commerce platform built with Angular (frontend) and Spring Boot (backend), supporting multiple user roles (Customer, Seller, Admin, Logistics), product variant management, order workflows, and Stripe payment integration.

## 🛠️ Technologies Used

- **Frontend:** Angular 16 + TypeScript + Tailwind CSS
- **Backend:** Spring Boot 3 + Java 17 + JWT + Stripe SDK
- **Database:** MySQL 8
- **Build Tools:** Maven, npm
- **Authentication:** JWT-based access & refresh tokens
- **Payments:** Stripe integration (test/live keys via env vars)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nisanurkaay/Fullstack-Ecommerce-WebApp.git
cd Fullstack-Ecommerce-WebApp/ecommerce-root
```

### 2. Environment Variables

Create a `.env` file at the `ecommerce-backend` and define the following:

#### Backend (`ecommerce-backend/.env`)
```env
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION_MS=${JWT_EXPIRATION_MS}

```
 Reference environment variables in `application.properties`:
```application.properties 
spring.datasource.url=jdbc:mysql://localhost:3306/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
jwt.secret=${JWT_SECRET}
jwt.expirationMs=${JWT_EXPIRATION_MS}
jwt.refreshExpirationMs=${JWT_REFRESH_EXPIRATION_MS}
server.port=${SERVER_PORT}
stripe.secret.key=${STRIPE_SECRET_KEY}


```

#### Frontend (`/src/environments/environment.ts`)
```environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',
  stripePublishableKey: STRIPE_PUBLISHABLE_KEY
};

```

---

### 3. Running the Application

#### Backend
```bash
cd ecommerce-backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd ecommerce_app
npm install
npm start
```

Open your browser at: [http://localhost:4200](http://localhost:4200)

---

## 👥 User Management Flows

- **Registration:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login` → Returns JWT access & refresh tokens
- **Refresh Token:** `POST /api/auth/refresh-token`
- **Logout:** `POST /api/auth/logout`
- **Profile:**  
  - `GET /api/users/me`  
  - `PUT /api/users/me`

---

## 👤 Role-Based Capabilities

| Role         | Capabilities |
|--------------|--------------|
| **Unauthenticated** | Browse products, view details |
| **Customer**        | Manage cart, place orders, track status |
| **Seller**          | Add/edit products, manage orders, view sales |
| **Admin**           | Moderate users/products, configure platform |
| **Logistics**       | Update shipping status, coordinate delivery |

---

## 🔄 Program Flow Overview

1. **Product Creation:**  
   Seller submits product → status: PENDING  
   Admin approves/rejects product  
   Seller publishes if approved → status: ACTIVE

2. **Ordering Process:**  
   Customer adds products from multiple sellers to cart  
   Checkout via Stripe → creates order  
   Each seller sees their items in My Orders  
   Partial/full refund logic handled automatically

3. **Shipment Tracking:**  
   Seller ships → Logistics Manager handles shipment statuses  
   Final status: DELIVERED updates order status

---

## 🖼️ ER & System Diagrams

> Refer to the `/docs` folder or final project PDF for attached diagrams (ER, backend, frontend).

---

## 📁 Project Structure

```
ecommerce-root/
├── ecommerce_app/        # Angular Frontend
├── ecommerce-backend/    # Spring Boot Backend
├── README.md

```

---

## 👩‍💻 Authors

- **Nisa Nur KAYA** 
- **Arzu Nasirli**
