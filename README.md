# Operations Management System

This project is an Operations Management System that allows users to manage operations and their associated suboperations. The system includes functionalities for creating, updating, deleting (soft and hard deletes), and retrieving operations and suboperations. The application has a frontend built with Node.js and a backend using PHP with Laravel, interfacing with a PostgreSQL database.

## Running the Project

To run the project locally using Docker, follow these steps:

1. **Run the services with Docker:**

```bash
    docker-compose up --build
```

2. **Run tests for the backend:**

```bash
    docker exec -it backend php artisan test
```

3. **Now your app is available at 'http://localhost/'**

## Contributing

Contributions are always welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch (`git checkout -b feature-branch`).**
3. **Commit your changes (`git commit -m 'Add some feature'`).**
4. **Push to the branch (`git push origin feature-branch`).**
5. **Open a pull request.**
