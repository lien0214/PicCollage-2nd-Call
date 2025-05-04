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

#### APIs

There are two APIs implemented in this project:
1. `/start-game`:

    ```typescript
    // Request Body
    {
        row: number,
        col: number,
        bombs: number
    }
    // Response
    { id: string }
    ```

2. `/reveal`:

    ```typescript
    // Request Body
    {
        id: string,
        row: number,
        col: number
    }
    // Response
    {
        board: { bomb: boolean, adjacent: number, revealed: boolean }[][],
        status: 'playing' | 'lost' | 'won',
        safeCellsLeft: number
    }
    ```

#### Features
- Implement 1st stage logic (board generation).
- Implement click action logic.
- Handle uuid.

## Time complexity

For API complexity

## Building Resilence

Besides the 

## Deferred Implementations

Due to the general and evolving nature of the project requirements, some optimizations and architectural decisions were noted but not implemented in this version—primarily related to frontend efficiency and backend scalability:

- Instead of using `setBoard` to update the entire board state, a more efficient approach would be to use `setRevealedCell`. This would significantly reduce the amount of data transferred between frontend and backend, especially for larger boards.
- To avoid sending large board data from the backend, the frontend could be responsible for rendering static or empty board states. This would offload unnecessary processing from the backend and reduce network payloads.
- Since JavaScript is single-threaded, it may not be ideal for CPU-bound operations. While async functions help with I/O, they don’t offer parallelism. For improved backend performance in highly concurrent scenarios, switching to a language like Go, Java, or C#—which support multithreading or goroutines—could lead to better scalability and responsiveness.