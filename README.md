# GoWebbo

## Project Description

GoWebbo is a secure multi-tenant API for practice registration and patient management. It ensures data isolation using separate databases per practice and implements secure authentication, input validation, and role-based access control.

## Features

- Secure user authentication with hashed passwords
- Multi-tenancy with database sharding per practice
- Practice registration with automatic database creation
- Patient management (CRUD operations)
- Soft delete for patients
- Basic authentication
- Email notifications on signup
- Database sharding for scalability

---

## Project Setup Guide

### **1. Clone the Repository**


 git clone https://github.com/NAWABZADE/Gowebbo.git
 cd Gowebbo


### **2. Install Dependencies**


 npm install


### **3. Set Up Database**

Ensure PostgreSQL is installed and running. Create a `gowebbo` database and enable the `uuid-ossp` extension.


psql -U postgres -c "CREATE DATABASE gowebbo;"
psql -U postgres -d gowebbo -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"


### **4. Configure Environment Variables**

Create a `.env` file in the root directory and add the following details:


PORT=5000
DB_HOST=your_database_host

DB_USER=postgres

DB_PASS=your_postgres_password

DB_NAME=gowebbo   

DB_PORT=5432

JWT_SECRET=your_secret_key

EMAIL_USER=your_email_user (from)

EMAIL_PASS=your_email_password (google app password for send email)

TOKEN_EXPIRE_IN = 1hr

ADMIN_USER_NAME= admin_user_name

ADMIN_PASSWORD = admin_password

REDIS_HOST = 127.0.0.1

REDIS_PORT =6379

### **5. Run server**

npm run start

### **6. Start the queue**

npm run start:queue

The API will be running at `http://localhost:5000`.

---

## Database Schema

### **Practices Table**

Before signing up, ensure the `practices` table is created:


CREATE TABLE practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    database_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


---

## API Documentation

### **1. Signup Practice**

**Endpoint:** `POST /api/v1/practices/signup`

**Request Body:**


{
  "name": "ABC Practice",
  "email": "abc@example.com",
  "password": "securepassword"
}


**Response:**


{
  "success": true,
  "status": 201,
  "message": "Practice registered successfully!",
  "result": {
    "id": "uuid",
    "name": "ABC Practice",
    "email": "abc@example.com"
  }
}


### **2. Login Practice**

**Endpoint:** `POST /api/v1/practices/login`

**Request Body:**

{
  "email": "abc@example.com",
  "password": "securepassword"
}


**Response:**

{
  "success": true,
  "status": 200,
  "message": "Login successful!",
  "token": "jwt_token_here"
}


### **3. Get All Practices**

**Endpoint:** `GET /api/v1/practices`

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Response:**


{
  "success": true,
  "status": 200,
  "message": "Practices fetched successfully!",
  "result": {
    "data": [
      {
        "id": "uuid",
        "name": "ABC Practice",
        "email": "abc@example.com"
      }
    ]
  }
}


### **4. Add a Patient**

**Endpoint:** `POST /api/v1/patients`

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**


{
  "name": "Patient A",
  "age": 30,
  "mobile": "9876543210"
}


**Response:**


{
  "success": true,
  "status": 201,
  "message": "Patient added successfully!",
  "result": {
    "id": "uuid",
    "name": "John Doe",
    "age": 30,
    "mobile": "9876543210",
    "is_deleted": 0
  }
}


### **5. Get All Patients (Active Only)**

**Endpoint:** `GET /api/v1/patients`

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Response:**


{
  "success": true,
  "status": 200,
  "message": "Patients fetched successfully!",
  "result": {
    "data": [
      {
        "id": "uuid",
        "name": "John Doe",
        "age": 30,
        "mobile": "9876543210",
        "is_deleted": 0
      }
    ]
  }
}


### **6. Soft Delete a Patient**

**Endpoint:** `DELETE /api/v1/patients/:id`

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Response:**


{
  "success": true,
  "status": 200,
  "message": "Patient deleted successfully!"
}



---

## Sharding Approach

To ensure scalability and high availability, GoWebbo implements **database sharding**. Each practice has its own dedicated database, which helps distribute the load across multiple databases and prevents a single point of failure.

### **Sharding Strategy**

- **Database-Level Sharding**: Each practice is assigned a unique database at the time of registration.
- **Connection Pooling**: Connections are managed dynamically for each practice to ensure efficient resource utilization.
- **Routing Logic**: Requests are routed to the correct database based on the authenticated practice.

### **Advantages of Sharding**

- Improved performance by distributing queries across multiple databases
- Isolation of tenant data for enhanced security
- Easy scalability by adding new databases when required

---


