# Operations Management System

This project is an Operations Management System that allows users to manage operations and their associated suboperations. The system includes functionalities for creating, updating, deleting (soft and hard deletes), and retrieving operations and suboperations. The application consists of a client built with Node.js, a backend server using PHP with Laravel, and utilizes NGINX as the web server, interfacing with a PostgreSQL database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   **Docker** and **Docker Compose** installed on your computer.
-   **Node.js** (version 16) installed.
-   **PHP** (version 8.1) installed.
-   **PostgreSQL** (version 14.2) installed.

## Running the Project

To run the project locally using Docker, follow these steps:

1. **Run the services with Docker:**

```bash
    docker-compose up --build
```

2. **Download composer dependecies:**

```bash
    docker exec -it backend composer install
```

3. **Run Laravel Migrations:**

```bash
    docker exec -it backend php artisan migrate:fresh
```

4. **Run tests for the server:**

```bash
    docker exec -it backend php artisan test
```

5. **Now your client is available at 'http://localhost:80/' and server at 'http://localhost:80/api/'**

6. **Run console command that will generate 100,000 operations**

```bash
    docker exec -it backend php artisan generate:operations
```

7. **Run console command that will paginate generated operations**

```bash
    docker exec -it backend php artisan paginate:operations
```

8. **Lastly, run console command that will delete all operations**

```bash
    docker exec -it backend php artisan delete:all-operations
```

## API Endpoints

### Operations

-   **GET /api/operations**: Retrieve a list of operations.
-   **POST /api/operations**: Create a new operation.
-   **PUT /api/operations/{uuid}**: Update an operation.
-   **DELETE /api/operations/{uuid}**: Soft delete an operation.
-   **DELETE /api/operations/{uuid}/force**: Hard delete an operation.

### Suboperations

-   **GET /api/operations/{operationUuid}/suboperations**: Retrieve suboperations for a specific operation.
-   **POST /api/suboperations**: Create a new suboperation.
-   **PUT /api/suboperations/{uuid}**: Update a suboperation.
-   **DELETE /api/suboperations/{uuid}**: Soft delete a suboperation.
-   **DELETE /api/suboperations/{uuid}/force**: Hard delete a suboperation.

## Contributing

Contributions are always welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch (`git checkout -b feature-branch`).**
3. **Commit your changes (`git commit -m 'Add some feature'`).**
4. **Push to the branch (`git push origin feature-branch`).**
5. **Open a pull request.**
