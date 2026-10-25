---
description: "Use when working on the Space Cowboy web application in app/."
applyTo: 'app/**/*'
---

# Space Cowboy Web Application


## Overview

- Application project is located in the `./app` folder.
- The web application is built using React, TypeScript and Vite.
- It uses Material UI (MUI) for the user interface components and styling.
- The application is a single-page application (SPA) that communicates with the backend service via RESTful APIs and a
  SignalR connection for real-time updates.


## Project Structure

The project follows a modular structure, with separate folders for components, pages, services, and utilities.

- `pages/`: Contains components representing application screens.
- `components/`: Contains custom React components.
- `hooks/`: Contains custom React hooks for state management and side effects.
- `images/`: Contains static image assets.
- `model`: Contains TypeScript interfaces and types for the application model (ref domain-driven design).
- `public/`: Contains static files that are served directly by the web server.
- `services/`: Contains code to interact with the service part of the application.
- `state/`: Persistent state management.
- `styles/`: Contains global styles and theme configuration for Material UI.
- `tests/`: Contains unit and integration tests for the application.
