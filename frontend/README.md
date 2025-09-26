# OceanEye Dashboard - SIH25039 Solution

A comprehensive coastal hazard monitoring platform built for Smart India Hackathon 2025, addressing problem statement SIH25039.

## 🌊 Project Overview

OceanEye is a unified platform that enables citizens, coastal residents, volunteers, and disaster managers to report observations during hazardous ocean events and monitor public communication trends via social media. The platform provides real-time monitoring and analysis of coastal hazards across India's 7,517 km coastline.

## 📋 Table of Contents

- [🎯 Problem Statement](#-problem-statement-sih25039)
- [✨ Key Features](#-key-features)
- [🛠️ Technical Stack](#️-technical-stack)
- [🚀 Getting Started](#-getting-started)
- [📱 Building For Production](#-building-for-production)
- [📊 Dashboard Features](#-dashboard-features)
- [🛠️ Development](#️-development)
- [🧭 Routing](#-routing)
- [Data Fetching](#data-fetching)
- [State Management](#state-management)
- [🧹 Demo Files](#-demo-files)
- [📚 Learn More](#-learn-more)

## 🎯 Problem Statement (SIH25039)

**Title:** Development of a Unified Platform for Crowdsourced Coastal Hazard Reporting and Social Media Monitoring for Enhanced Early Warning Systems

**Challenge:** India's vast coastline faces numerous ocean hazards like tsunamis, storm surges, high waves, and unusual sea behavior. Current warning systems lack real-time ground truth and public communication insights.

## ✨ Key Features

### 📊 Dual Dashboard System
- **Citizen Reports Panel**: Real-time visualization of geotagged incident reports
- **Social Media Monitoring Panel**: AI-powered analysis of social media discussions

### 🗺️ Interactive Mapping
- Real-time incident locations with severity indicators
- Dynamic hotspot generation based on report density
- Comprehensive map controls and filtering options

### 📱 Comprehensive Reporting
- Geotagged reports with photo/video uploads
- Severity classification (High/Medium/Low)
- Verification system for incident validation

### 📈 Social Media Intelligence
- NLP-powered hashtag trend analysis
- Multi-platform monitoring (Twitter, Facebook, YouTube)
- Sentiment analysis and engagement metrics

## 🛠️ Technical Stack

- **Frontend**: React 19 with TanStack Start (SSR)
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS 4.0 + ShadCN UI
- **State Management**: TanStack Query
- **Package Manager**: Bun

## 🚀 Getting Started

To run this application:

```bash
bun install
bun run dev
```

Open your browser to `http://localhost:3000`

## 📱 Building For Production

To build this application for production:

```bash
bun run build
```

## 📊 Dashboard Features

- **Live Statistics**: Active reports, social mentions, user activity
- **Interactive Map**: Visual incident mapping with severity indicators  
- **Report Management**: Detailed citizen report views with media
- **Social Monitoring**: Real-time social media analysis
- **Trending Analysis**: Hashtag trends and engagement metrics
- **Advanced Filtering**: Location, time, and severity-based filters

## 🛠️ Development

### Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bunx --bun run test
```

### Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:

```bash
bunx --bun run lint
bunx --bun run format
bunx --bun run check
```

### UI Components

Add components using the latest version of [Shadcn](https://ui.shadcn.com/):

```bash
pnpx shadcn@latest add button
```



## 🧭 Routing

This project uses [TanStack Router](https://tanstack.com/router) with a file-based routing system. Routes are managed as files in the [`src/routes`](src/routes) directory.

### Adding A Route

To add a new route to your application, simply create a new file in the [`./src/routes`](./src/routes) directory.

TanStack Router will automatically generate the content of the route file for you.

Once you have multiple routes, you can use the `Link` component to navigate between them.

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

In the file-based routing setup, the layout is located in [`src/routes/__root.tsx`](src/routes/__root.tsx). Anything you add to the root route will appear in all routes. The route content will appear in the JSX where you use the `<Outlet />` component.

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

### TanStack Query

TanStack Query is an excellent addition or alternative to route loading and integrating it into your application is a breeze.

First add your dependencies:

```bash
bun install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in [`main.tsx`](src/main.tsx).

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

You can find out everything you need to know on how to use TanStack Query in the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
bun install @tanstack/store
```

Now let's create a simple counter in the [`src/App.tsx`](src/App.tsx) file as a demonstration.

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

## 🧹 Demo Files

Files prefixed with `demo` can be safely deleted. They are included to provide a starting point for you to explore and experiment with the features you've installed.

## 📚 Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
