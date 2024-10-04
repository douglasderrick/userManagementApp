# User Management Web Application

A simple web application for managing users with features to add, update, delete, and view users based on gender.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Backend Setup (Laravel)](#backend-setup-laravel)
    - [Frontend Setup (React with Vite)](#frontend-setup-react-with-vite)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)

## Prerequisites

Make sure you have the following installed:

- **PHP** (>= 8.1)
- **Composer**
- **Node.js** (>= 14.x)
- **npm** (>= 6.x)
- **MySQL** (>= 5.7)
- **Git**

## Installation

### Clone the Repository

1. Open your terminal.
2. Clone the repository:

   ```bash
   git clone <https://github.com/douglasderrick/userManagementApp>
    ```
   
### Backend Setup (Laravel) and Frontend Setup (React with Vite)

1. Navigate to the project directory:

   ```bash
   cd userManagementApp
   ```
   
2. Install the backend dependencies:

   ```bash
    composer install
    ```
   
3. Install the frontend dependencies:
4. Navigate to the frontend directory:

   ```bash
   npm install
   ```
   
5. Create a `.env` file in the root directory of the project and copy the contents of the `.env.example` file to it:

   ```bash
    cp .env.example .env
    ```
   
6. Generate an application key:
7. Run the following command:

   ```bash
   php artisan key:generate
   ```
   
8. Create a new database and update the database credentials in the `.env` file:

   ```bash
    DB_CONNECTION=mysql
    DB_HOST=
    DB_PORT=
    DB_DATABASE=
    DB_USERNAME=
    DB_PASSWORD=
    ```
   
9. Run the database migrations:
10. Run the following command:

    ```bash
    php artisan migrate
    ```
    
11. Seed the database with dummy data:
12. Run the following command:

    ```bash
    php artisan db:seed
    ```
    
13. Build the frontend assets:
14. Run the following command:

    ```bash
    npm run build
    ```
    
## Running the Application

1. Start the Laravel development server:
2. Run the following command:

   ```bash
   php artisan serve
   ```
   
3. Start the Vite development server:
4. Run the following command:

   ```bash
   npm run dev
   ```
   
5. Open your browser and visit `http://localhost:3000`.

## API Endpoints

The following are the API endpoints available in the application:

- `GET /api/v1/users`: Get all users.
- `POST /api/v1/users`: Create a new user.
- `GET /api/v1/users/{id}`: Get a user by ID.
- `DELETE /api/v1/users/{id}`: Delete a user by ID.

## Usage

1. Open your browser and visit `http://localhost:3000`.
2. Click on the `Users` link in the navigation bar to view all users.
3. Click on the `Add User` button to add a new user.
4. Click on the `Edit` button to update a user.
5. Click on the `Delete` button to delete a user.
6. Use the search bar to filter users based
7. Use the filter dropdown to filter users

   
   
