# Next Trackoverload (provisional name)

A full-stack web application designed to take control of your fitness.

## Demo / Screenshots

Demo: currently not available.

## Why this project exists

This project was created to implement the method that I follow to gain muscle and lose fat. Combining both exercise and nutrition in one user-focused place.

- Ease of batch meals logging.
- Tracking only important nutritional information.
- Tracking of workout sessions.

## Problem it solves

Every nutrition app that I have used is cumbersome. They provides lots of irrelevant data and make the tracking process tedious. This app aims to make it easy.

## Architecture

The project follows Clean Architecture principles and design patterns:

- Domain: entities, value objects, errors, service interfaces and repo interfaces.
- Application: use cases and DTOs.
- Infrastructure: implementation of the interfaces. Currently:
  - Memory repos and image management.
  - Filesystem repos and image management.
  - (to come) Supabase repos and image management.
  - Next.js app router.
- Interface-adapters: Dependency injection of repos and services to Next.js app. It selects between Filesystem implementation for development and Memory implementation for integration testing.

## Tech stack

- Next.js (React)
- (In the future) PostgreSQL powered by Supabase
- Docker.

The stack was chosen for security and long-term maintainability.

## Key technical decisions.

- Value Objects are used for data validation in domain entities.
- No third party code is allowed in the application and domain layers.
- Business and application rules throw errors.
- Domain, application and presentation layers are fully testable without infrastructure.
  - Some integration test will be needed when implementing external services, but they will be independent.

## Testing

- Unit tests for domain layer.
- Unit tests for application layer.
- Integration tests for presentation layer.

## What you can learn from this project

- How to structure a project using Clean Architecture
- How to design value objects in TypeScript
- How to avoid framework coupling
