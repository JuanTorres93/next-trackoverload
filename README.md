<h1>
  <img src="./public/logo.svg" alt="Cimientos logo" width="34" /> 🧱 Cimientos
</h1>

Track the few things that actually matter if you want to change your body: calories, protein, and training.

Live app: https://cimientos.app

This is a full-stack TypeScript project I am building around a simple idea: most fitness apps ask for too much, show too much, and make consistency harder than it needs to be. I wanted the opposite. Something focused, fast, and opinionated.

## 🧱 What this project is

Cimientos is a nutrition-first fitness tracker built with Next.js and a Clean Architecture core.

Right now, the app is centered on:

- user registration and login
- weekly meal planning
- recipe creation and management
- ingredient search by name and barcode
- a dashboard focused on the current day

There is also workout-related domain and application logic in the codebase, because I want food and training to live in the same product instead of pretending they are separate problems.

## 🎯 Why I built it

I care a lot about physical health, long-term progress, and tools that remove friction instead of adding it.

When I started taking nutrition seriously, I ran into the same problem over and over again: logging food was slow, noisy, and mentally expensive. Most apps felt like data warehouses. I do not want a data warehouse. I want a tool that helps me stay consistent.

That is the idea behind this project.

## ⚙️ What is interesting here from an engineering point of view

- Clean Architecture with clear boundaries between domain, application, infrastructure, and Next.js-specific code
- domain rules enforced with value objects instead of scattering validation across the UI and API layer
- framework-agnostic business logic that can be tested without booting the app
- custom auth flow using JWT and bcrypt
- MongoDB repositories for persistence
- Cloudinary integration for image storage
- OpenFoodFacts integration for ingredient lookup
- image processing pipeline for uploads
- broad automated test coverage across domain, application, UI, and infrastructure

This is not a toy repo where everything important lives in page components. The main effort is in keeping business logic explicit, isolated, and replaceable.

## 🛠️ Current stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- MongoDB with Mongoose
- Cloudinary
- Vitest + Testing Library
- ESLint

## 🗂️ Project structure

```text
src/
  domain/               Core entities, value objects, repo contracts
  application-layer/    Use cases and DTOs
  infra/                Mongo, Cloudinary, auth, external services
  interface-adapters/   Wiring from the app into the use cases
  app/                  Next.js App Router UI and API routes
```

## 🚀 Running it locally

1. Install dependencies.
2. Copy `env.env.example` into your local env file.
3. Fill in MongoDB, Cloudinary, JWT, and OpenFoodFacts credentials.
4. Start the dev server.

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run test
npm run test:watch
npm run lint
npm run build
```

## 🚧 Status

This project is still in progress.

The nutrition flow is the most mature part of the product today. Some broader ideas in the domain, especially around training, are already modelled in code but not fully exposed through the current UI yet.

That is intentional. I prefer building the core properly before pretending the surface is finished.

## 💼 Why this repo matters to me

I built this project to practice the kind of software engineering I want to be hired for: clear architecture, strong validation, good tests, and product decisions that come from real use rather than feature inflation.

If you are hiring for full-stack TypeScript work and you care about maintainability, separation of concerns, and shipping with intent, this repo is a good representation of how I think.

## 🤝 Contact

- Website: https://www.juantorres.me/
- LinkedIn: https://www.linkedin.com/in/juantorresnavarro/
- YouTube: https://www.youtube.com/@JuanT93
