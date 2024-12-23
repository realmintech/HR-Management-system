# HR Management System

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Description
The HR Management System is a web application designed to streamline human resource processes, including employee management, authentication, and analytics. This application provides a user-friendly interface for HR professionals to manage employee data efficiently.

## Features
- **User Authentication**: Secure registration and login for users.
- **Employee Management**: Create, read, update, and delete employee records.
- **Role-Based Access Control**: Different access levels for admin and regular users.
- **Data Validation**: Ensures that all input data is validated before processing.
- **API Documentation**: Automatically generated API documentation using Swagger.
- **Responsive Design**: Mobile-friendly interface for better accessibility.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest, Supertest
- **Other Libraries**: CORS, Helmet, XSS Clean, Mongo Sanitize, Compression

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Clone 
cd hr-erp-backend

### Install Dependencies

```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory and add the following variables:
```bash
MONGO_URI=mongodb://localhost:27017/hr_management
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

## Usage
- Navigate to `http://localhost:5000/api-docs` or [https://wastech-erp-system.onrender.com/api-docs/](https://wastech-erp-system.onrender.com/api-docs/) to view the API documentation.
- Use tools like Postman or Insomnia to test the API endpoints.

## API Endpoints
### Authentication Management
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login a user.
- **GET** `/api/auth/profile`: Get the user profile (protected).
- **PUT** `/api/auth/profile`: Update the user profile (protected).

### Employee Management
- **GET** `/api/employees/all`: Retrieve all employees (protected).
- **GET** `/api/employees/analytics`: Get employee analytics (protected).
- **PUT** `/api/employees/:id/update-status`: Update an employee's status (protected).
- **DELETE** `/api/employees/:id`: Delete an employee (protected).
- **GET** `/api/employees/deleted`: Get a list of deleted employees.
- **PATCH** `/api/employees/:id/restore`: Restore a deleted employee (protected).
- **GET** `/api/employees/profile`: Get the profile of the currently authenticated employee (protected).

## Testing
To run the tests, use the following command:
```bash
npm test
```
