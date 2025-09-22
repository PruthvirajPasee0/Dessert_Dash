# Dessert Dash

## Project Overview

Dessert Dash is a full-stack web application designed to be the best in the town dessert discovery platform. It allows users to browse a wide variety of desserts from different vendors, place orders, and have them delivered to their doorstep. The application features a user-friendly interface for customers and a robust dashboard for vendors to manage their products and orders.

Here is the video showcasing the full tour of the application:  

``https://drive.google.com/file/d/1AQaFZGXe2jBnOyMyBnLr-WePyYM3FvO6/view?usp=sharing``

## Setup Instructions

To get the Dessert Dash application running locally, please follow these steps:

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (or another compatible database for Prisma)

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Set up the database:**

   - Make sure your PostgreSQL server is running.
   - Create a `.env` file in the `backend` directory and add your database connection string:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
     ```
   - Run the Prisma migrations to create the database schema:
     ```bash
     npx prisma migrate dev
     ```
4. **Start the backend server:**

   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend will be accessible at `http://localhost:5173`.

## Application Screenshots

HomePage:

![1758384331064](image/README/1758384331064.png)

Admin DashBoard:

![1758384361011](image/README/1758384361011.png)

Login/Register Page:

![1758533643440](image/README/1758533643440.png)Cart Page:

![1758384439380](image/README/1758384439380.png)

Checkout Page:

![1758384463836](image/README/1758384463836.png)

Payment Confirmation Page:

![1758384488114](image/README/1758384488114.png)

Profile Page:

![1758534032608](image/README/1758534032608.png)

## My AI Usage

This project was developed with the assistance of several AI tools to accelerate the development process and improve the final product.

### AI Tools Utilized

- **ChatGPT:** Brainstorming API endpoint structures and generating initial code snippets.
- **Gemini:** Error correction, debugging, and validating API responses.
- **Banani:** UI generation and creating responsive layouts.
- **Stitch:** Screen design and prototyping user flows.
- **Figma AI:** Generating UI elements and reusable components.
- **Claude AI:** Resolving complex bugs and providing alternative solutions.

### Usage Details

- **ChatGPT** was used to brainstorm the initial structure of the API, helping to define the resources and endpoints for users, products, and orders.
- **Gemini** played a crucial role in debugging and error correction. For example, it helped identify and fix syntax errors in the backend code and validate API responses.
- **Banani** was leveraged to generate the basic UI for the product listing and checkout pages, which were then customized to fit the application's theme.
- **Stitch** was used to design the user flow from browsing products to placing an order, ensuring a seamless and intuitive user experience.
- **Figma AI** automated the creation of reusable UI components like buttons, input fields, and cards, which significantly sped up the design process.
- **Claude AI** was instrumental in resolving a persistent bug related to state management in the frontend, providing a clear and effective solution.

### Workflow Reflection

The use of AI tools was a game-changer in the development of Dessert Dash, especially given the time constraints of a mid-semester project. AI-powered code generation and debugging significantly reduced the time spent on repetitive tasks and troubleshooting. The ability to quickly prototype UI designs and generate components allowed for a more iterative and efficient development workflow. Overall, the integration of these AI tools not only accelerated the project's completion but also improved the quality and consistency of the final product.
