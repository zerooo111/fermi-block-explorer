import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/address/$pubkey")({
	component: AddressPage,
});

function AddressPage() {
	const { pubkey } = Route.useParams();

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Address Details</h1>
				<p className="text-muted-foreground font-mono text-sm break-all">
					{pubkey}
				</p>
			</div>

			<div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg
							className="h-5 w-5 text-yellow-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-label="Warning icon"
						>
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
							Address Tracking Not Yet Implemented
						</h3>
						<div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
							<p>
								Address-specific transaction history requires custom indexing.
								This feature will be added in a future update.
							</p>
							<p className="mt-2">To implement this feature, you'll need to:</p>
							<ul className="list-disc ml-5 mt-1 space-y-1">
								<li>Create a database index on transaction owner fields</li>
								<li>Add a new API endpoint to query transactions by owner</li>
								<li>Build the frontend integration for the new endpoint</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 rounded-lg border bg-card p-6">
				<h2 className="text-lg font-semibold mb-4">Address Information</h2>
				<dl className="space-y-3">
					<div>
						<dt className="text-sm text-muted-foreground">Public Key</dt>
						<dd className="font-mono text-sm break-all">{pubkey}</dd>
					</div>
					<div>
						<dt className="text-sm text-muted-foreground">Address Type</dt>
						<dd>Solana Public Key (Base58)</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
