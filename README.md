# Clinified Hub

Clinified Hub is a Healthcare platform built for patients, providers, admins, and super admins. It streamlines appointment booking, provider onboarding, payment management, and day-to-day operational visibility through a modern Laravel and React stack.

## Project Demo

<p>Click the preview below to watch the demo. Use Ctrl + Click or open in a new tab if needed.</p>

<a href="https://youtu.be/W4WmxTHukLo">
  <img src="https://img.youtube.com/vi/W4WmxTHukLo/maxresdefault.jpg" alt="Project Demo" width="100%" />
</a>

## Highlights

- Role-based dashboards for clients, providers, admins, and super admins
- Appointment booking, scheduling controls, and calendar management
- Doctor application review flow with protected document and photo access
- Patient, provider, and admin management
- Payment review and approval workflows
- Profile management, including avatar uploads

## Tech Stack

- Backend: Laravel 12, PHP 8.4, Inertia.js
- Frontend: React 19, TypeScript, Vite
- Database: MySQL
- UI: Tailwind CSS v4, Radix UI, Material UI, Lucide Icons
- Tooling: PNPM, ESLint, Prettier, Laravel Pint, Pest

## Getting Started

### Requirements

- PHP 8.4+
- Composer
- Node.js 22+
- PNPM
- MySQL

### Installation

```bash
composer install
pnpm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
```

Update your `.env` with your database and mail configuration before running the app.

This project was tested with a MySQL database.

### Run Locally

```bash
composer dev
```

This starts the Laravel server, queue listener, logs, and Vite development server together.

## Quality Checks

Run the full quality pipeline with:

```bash
composer qa
```

This runs Pint, Prettier, ESLint, TypeScript checks, the Laravel test suite, and the production build.

## Testing

```bash
php artisan test
```
