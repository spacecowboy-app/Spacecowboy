# Space Cowboy


## Overview

Space Cowboy is an application for teams to make quick decisions while avoiding groupthink. It is bascially an implementation of Planning Poker with a set of decks to make different kinds of decisions. It supports various types of decks, including numeric, Fibonacci, T-shirt sizes, and decks for triage decisions and a Likert scale.

The application consists of a web application and a backend API.


## Web Application

- Application project is located in the `./app` folder.
- The web application is built using React and TypeScript.


## Backend Service

- Service project is located in the `./service` folder.
- The service is built using .NET 8 and C#.


## Changes

- Development is always done on a feature branch, which is then merged into the `main` branch via a pull request.
- Pull requests must be approved and merged by a human reviewer.
- Pull requests can only modify files under either the `app` or `service` folders, but not both. All pull requests
  can modify files outside those folders, such as documentation and configuration files.
- The `main` branch is always deployable and must always pass all tests.


## Test environment

- A local test environment can be set up using Docker Compose.
