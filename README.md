# Benmore Assessment

This is a full-stack web application built with Next.js and TypeScript. It features authentication, event management, ticketing, and user management modules. The project uses API routes for backend logic and a mock database for local development.

## Prerequisites

- Node.js (v18 or higher recommended)
- Yarn (preferred) or npm

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd benmore-assessment
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Run the development server:**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — Main application pages and API routes
- `src/components/` — Reusable UI components
- `src/utils/` — Utility functions and helpers
- `src/db.json` — Mock database for local development

## Scripts

- `yarn dev` — Start the development server
- `yarn build` — Build the application for production
- `yarn start` — Start the production server
- `yarn lint` — Run ESLint

## Notes

- The project uses a mock database (`src/db.json`). For production, integrate a real database.
- Environment variables can be set in a `.env.local` file if needed.

## License

This project is for assessment purposes only.
