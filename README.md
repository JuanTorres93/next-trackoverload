# 💪 Next Trackoverload (provisional name)

A full-stack web application designed to help getting the body you want.

<!-- ## Demo / Screenshots -->
<!--  -->
<!-- Demo: currently not available. -->

## 🌟 Why this project exists

This project was created to implement the method that I follow to gain muscle and lose fat. It combines both exercise and nutrition in one user-focused app.

- Ease of batch meal logging.
- Tracking only important nutritional information.
- Tracking of workout sessions.

## 🔧 Problem it solves

Every nutrition app that I have used is cumbersome. They provide lots of irrelevant data and make the tracking process tedious. This app aims to make it easy.

## 🏗️ Architecture

The project follows Clean Architecture principles:

- **Domain**: entities, value objects, errors, service interfaces and repo interfaces.
- **Application**: use cases and DTOs.
- **Infrastructure**: implementation of the interfaces. Currently:
  - Memory repos and image management.
  - Filesystem repos and image management.
  - (To come) Supabase repos and image management.
  - Next.js app router.
- **Interface-adapters**: Dependency injection of repos and services to Next.js app. It selects between Filesystem implementation for development and Memory implementation for integration testing.

## 🎩 Tech stack

- Next.js (React)
- (In the future) PostgreSQL powered by Supabase
- Docker container for development.

The stack was chosen for security and long-term maintainability.

## 🗝️ Key technical decisions.

- Value Objects are used for data validation in domain entities.
- No third party code is allowed in the application and domain layers.
- Business and application rules throw errors.
- Domain, application and presentation layers are fully testable without infrastructure.
  - Some integration test will be needed when implementing external services, but they will be independent.

## 🕵️ Testing

- Unit tests for domain layer.
- Unit tests for application layer.
- Integration tests for presentation layer.

## 👨‍🎓 What you can learn from this project

- How to structure a project using Clean Architecture
- How to design value objects in TypeScript
- How to avoid framework coupling

<!-- ## Running the project -->
<!--  -->
<!-- ``` -->
<!-- npm install -->
<!-- npm run dev -->
<!-- ``` -->

## 🕺 About the author

I am a full-stack developer focused on clean design, maintainability and scalable software. I love growth, personal develpment and salsa dancing 😘.

- Website: https://www.juantorres.me/
- LinkedIn: https://www.linkedin.com/in/juantorresnavarro/
- YouTube: https://www.youtube.com/@JuanT93
