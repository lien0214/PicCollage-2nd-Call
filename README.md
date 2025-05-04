# PicCollage-2nd-Interview-Project: Minesweeper

## Tech Stack

- Frontend: React (Next.js), TypeScript, CSS Modules / Tailwind-style
- Backend: NestJS (TypeScript), UUID

## Quickstart

The project is develop under npm 22.14.0, please make sure you have the npm version.
1. run `npm install`, `npm run install:all` to install the required package
2. run `npm run dev:backend` to run the backend
3. run `npm run dev:frontend` to run the frontend

## Design Explanation

### Frontend

#### Features
- Render the page.
- Implement flag action logic.
- Implement Timer logic.

### Backend

#### Features
- Implement 1st stage logic (board generation).
- Implement click action logic.
- Handle uuid.

## Time complexity

For API complexity

## Building Resilence

### Respond those which only being updated

Concerning the board size may be huge, it is better to return the "updated cell" but not the whole board to optimize the efficiency.