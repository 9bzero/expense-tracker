<div align="center">

  # Expense Tracker

  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Recharts](https://img.shields.io/badge/Recharts-22C55E?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yIDIwaDIwdi0ySDJ2MnoiLz48L3N2Zz4=&logoColor=white)](https://recharts.org/)

  **Personal finance tracker with interactive pie and bar charts.**

  </div>

  ---

  ## Features

  - **Summary cards** — balance, total income, total expenses
  - **Pie chart** — expense breakdown by category
  - **Bar chart** — monthly income vs expense comparison
  - **9 categories** — Food, Transport, Housing, Entertainment, Health, Shopping, Salary, Freelance, Other
  - **Filter** — view all / income only / expenses only
  - **Persistent** — `localStorage` storage

  ## Getting Started

  ```bash
  npm install && npm run dev
  ```

  ## Data Model

  ```typescript
  type Entry = {
    id: string
    title: string
    amount: number
    type: 'income' | 'expense'
    category: Category
    date: string  // ISO date string
  }
  ```

  ---

  <div align="center">Made with TypeScript · Part of my <a href="https://github.com/9bzero">developer portfolio</a></div>
  