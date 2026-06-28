---
applyTo: 'service/**/*'
---

# Space Cowboy Service


## Overview

- Service project is located in the `./service` folder.
- The service is built using .NET Core and C#.
- It provides RESTful APIs for the web application and manages real-time updates via SignalR.


## Project Structure

- The project follows a modular structure, with separate folders for controllers, models, services, and utilities.
- `src/Controllers/`: Contains API controllers for handling HTTP requests.
- `src/Infrastructure/`: Contains classes for data access, configuration, and other infrastructure concerns.
- `src/Model/`: Contains C# classes representing the application domain model.
- `wwwroot/`: Contains static files that are served directly by the web server.
- `tests/`: Contains unit and integration tests for the service.
