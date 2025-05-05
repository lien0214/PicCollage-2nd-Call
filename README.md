# PicCollage-2nd-Interview-Project: Minesweeper

## Tech Stack

- Frontend: React (Next.js), Typescript, CSS Modules / Tailwind-style
- Frontend-Vue: Vue, Typescript, CSS
- Backend: NestJS (TypeScript), UUID

## Quickstart

The project is develop under npm 22.14.0, please make sure you have the npm version.
1. run `npm install`, `npm run install:all` to install the required package
2. run `npm run dev:backend` to run the backend
3. run `npm run dev:frontend` to run the frontend(next.js project)
3. run `npm run dev:frontend:vue` to run the frontend(vue project)

## Design Explanation

My design sequence is first design the APIs. The first frontend I completed was next.js project. It is because of my misunderstanding of the relationship between vue and next.js. Therefore, the implementation of vue project is more in code translation but not design.

### Frontend (both vue and nextjs)

#### Features
- Render the page correctly.
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
- Code optimization.

## Building Resilence

### Backend Services Cache

I have implemented a easy sliding-cache-like mechanism to cache each game, including the board, with id. This can lower the memory waste for those who doesn't visit for long time.

### API content optimization

At the first version, the design of api is not like this but sending entire board from end to end for both apis, which waste time. The optimization includes delete the redundant response content in `game/start-game` and decrease the entire board return to revealed cells and their postion.

### Reveal Safe Cells

At the first version, I implement it with recursion dfs; however, I found that the call stack will not be enough if the board is big but less bombs. I modified it with while loop solution.

## Deferred Implementations (before optimization)

Due to the general and evolving nature of the project requirements, some optimizations and architectural decisions were noted but not implemented in this version—primarily related to frontend efficiency and backend scalability:

- To avoid sending large of `revealedCell`, we can compress the payload.
- In the frontend, I didn't implement the invalid input UI handling, but only implement it at the backend side. Those output should be designed
- Since JavaScript is single-threaded, it may not be ideal for CPU-bound operations. While async functions help with I/O, they don’t offer parallelism. For improved backend performance in highly concurrent scenarios, switching to a language like Go, Java, or C#—which support multithreading or goroutines—could lead to better scalability and responsiveness.
- Because the time is urgent in this stage, I have no time make overall code more OOP. The next stage is to refactor the code first to more scalable and readable version.

## AI Assist

1. Css refactor
2. Vue syntax help
3. Documentation refinement