# Fermi Block Explorer

A modern, real-time blockchain explorer for the Fermi rollup. Built with React, TanStack Router, TanStack Query, and Tailwind CSS.

## Features

- **Real-time Block Updates** - WebSocket integration for live block data
- **Comprehensive Block Explorer** - View blocks, transactions, and batch summaries
- **Market Information** - Browse and filter perpetual and spot markets
- **Transaction Details** - Detailed view of orders and cancellations
- **Responsive Design** - Mobile-friendly interface with dark mode support
- **Type-safe API** - Full TypeScript integration with API types

## Prerequisites

- Bun runtime installed
- Fermi rollup node running on `http://localhost:8080` (or configured API endpoint)

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment (Optional)

Copy the example environment file and customize if needed:

```bash
cp .env.example .env
```

Edit `.env` to configure API endpoints:

```env
VITE_API_BASE=http://localhost:8080
VITE_WS_BASE=ws://localhost:8080
```

### 3. Run Development Server

```bash
bun --bun run dev
```

The explorer will be available at `http://localhost:3000`

## Available Pages

- **Dashboard** (`/`) - Overview with latest blocks and chain statistics
- **Blocks** (`/blocks`) - Paginated list of all blocks
- **Block Detail** (`/blocks/:height`) - Detailed view of a specific block
- **Transaction Detail** (`/transactions/:id`) - Individual transaction information
- **Markets** (`/markets`) - List of all configured markets
- **Market Detail** (`/markets/:id`) - Market details and event history

## Building For Production

To build this application for production:

```bash
bun --bun run build
```

The build artifacts will be in the `dist/` directory.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
bun --bun run lint      # Lint code
bun --bun run format    # Format code
bun --bun run check     # Run both lint and format checks
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlockCard.tsx
│   ├── TransactionList.tsx
│   ├── Pagination.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useApi.ts       # React Query hooks for API
│   └── useBlockFeed.ts # WebSocket hook for real-time updates
├── lib/                # Utility functions
│   ├── api.ts          # API client
│   ├── formatters.ts   # Data formatting utilities
│   └── utils.ts        # General utilities
├── routes/             # TanStack Router file-based routes
│   ├── index.tsx       # Dashboard
│   ├── blocks.tsx      # Blocks list
│   ├── blocks.$height.tsx
│   └── ...
└── types/              # TypeScript type definitions
    └── api.ts          # API response types
```


## Adding UI Components

This project uses [Shadcn UI](https://ui.shadcn.com/) for components. Add new components:

```bash
pnpx shadcn@latest add <component-name>
```

Example:
```bash
pnpx shadcn@latest add button
pnpx shadcn@latest add card
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
bun install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
bun install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

## API Integration

The explorer connects to the Fermi rollup node REST API and WebSocket endpoint. See the [API Guide](https://github.com/your-repo/docs/API_GUIDE.md) for detailed endpoint documentation.

### Key API Endpoints

- `GET /status` - Node status and chain info
- `GET /blocks/latest` - Latest block with transactions
- `GET /blocks/:height` - Specific block details
- `GET /markets` - All configured markets
- `WS /ws/blocks` - Real-time block feed

## Technologies Used

- **React 19** - UI framework
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Biome** - Linting and formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

- [TanStack Documentation](https://tanstack.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Fermi Rollup Documentation](https://github.com/your-repo/docs)
