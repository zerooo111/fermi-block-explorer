import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
		<header className="sticky top-0 left-0 border-y bg-muted py-2 ">
			<nav className="container flex items-center justify-between mx-auto px-6 max-w-7xl">
				<div className="text-2xl font-bold">
					FERMI
				</div>
				<div className="flex items-center gap-4">
					<a href="/" className="hover:underline">Home</a>
					<a href="/blocks" className="hover:underline">Blocks</a>
				</div>
			</nav>
		</header>
			<Outlet />
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					TanStackQueryDevtools,
				]}
			/>
		</>
	),
});
