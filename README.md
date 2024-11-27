# Game of Life

This project is implementation of game of life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

The tech stack used is React + Typescript + Vite.

## Rules

Install packages

```bash
npm i
```

Run in dev
```bash
npm run dev
```

Start prod + preview
```bash
npm run build
npm run preview
```

Run tests
```bash
npm run test
```

## Future improvements
1. Use playwright to test canvas interaction
1. Write tests for App.tsx
1. Current history implementation is a bit of cheat code, as clicking "Previous" erases the state right after it from the history
1. I think game context can be improved, as well as some interactions.
