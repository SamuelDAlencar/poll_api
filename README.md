# Poll API

## Overview
This project provides a simple Poll API that allows users to create and participate in polls. It is built with a focus on scalability, reliability, and maintainability.

## Features
- Create, read, update, and delete poll entities
- Endpoint for voting on existing polls
- Validation and error handling for all public endpoints

## Technologies & Standards
- Node.js & Express for server-side
- RESTful routes and clear separation of concerns
- Coding conventions enforced via linting rules (e.g., ESLint)
- Unit and integration testing to ensure code quality
- Consistent commit messages following a conventional style

## Getting Started
1. Clone the repository and install dependencies.
2. Configure your environment variables in a `.env` file if needed.
3. Run `npm start` to launch the application.
4. Execute tests with `npm test`.

## Additional Details
This project was created in collaboration with Rodrigo Manguinho, applying Clean Architecture principles from the Clean API course. Emphasis was placed on the separation of concerns, ensuring test coverage with TDD, and following best practices such as Dependency Inversion and repository patterns. This design choice helps maintain a robust and extensible codebase, promoting scalability as the project grows.
