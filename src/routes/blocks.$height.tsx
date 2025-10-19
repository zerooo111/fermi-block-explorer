import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import { useBlock } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
	formatNumber,
	formatRelativeTime,
	formatTimestamp,
} from "@/lib/formatters";

export const Route = createFileRoute("/blocks/$height")({
	component: BlockDetailPage,
});

function BlockDetailPage() {
	const { height } = Route.useParams();
	const blockHeight = Number.parseInt(height, 10);
	const { data, isLoading, error } = useBlock(blockHeight);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-6 py-8 max-w-7xl">
				<ErrorMessage message={(error as Error).message} />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="container mx-auto px-6 py-8 max-w-7xl">
				<ErrorMessage message="Block not found" />
			</div>
		);
	}

	const stateRootHex = data.block.state_root
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 py-12 max-w-7xl">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/blocks"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
					>
						<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						Back to Blocks
					</Link>
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-4xl font-bold font-mono tabular-nums mb-2">
								Block #{data.block.height.toLocaleString()}
							</h1>
							<div className="space-y-1">
								<p className="text-lg font-mono text-foreground">
									{formatTimestamp(data.block.produced_at)}
								</p>
								<p className="text-sm text-muted-foreground">
									{formatRelativeTime(data.block.produced_at)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content Container */}
				<div className="border">
					{/* Overview Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Transactions
							</p>
							<p className="text-4xl font-bold font-mono tabular-nums">
								{data.block.transaction_ids.length}
							</p>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Orders
							</p>
							<p className="text-4xl font-bold font-mono tabular-nums">
								{data.block.total_orders}
							</p>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Cancels
							</p>
							<p className="text-4xl font-bold font-mono tabular-nums">
								{data.block.total_cancels}
							</p>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Batches
							</p>
							<p className="text-4xl font-bold font-mono tabular-nums">
								{data.block.batch_summaries.length}
							</p>
						</div>
					</div>

					{/* State Root */}
					<div className="border-t p-6">
						<h2 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider mb-3">
							State Root
						</h2>
						<div className="flex items-start justify-between gap-4">
							<p className="font-mono text-neutral-500 text-sm break-all flex-1">
								{stateRootHex}
							</p>
							<button
								type="button"
								onClick={() => copyToClipboard(stateRootHex)}
								className="p-2 hover:bg-muted transition-colors flex-shrink-0"
								aria-label="Copy state root"
							>
								<Copy className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Batch Summaries */}
					{data.block.batch_summaries.length > 0 && (
						<div className="border-t">
							<div className="px-6 py-3 bg-muted border-b">
								<h2 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
									Batch Summaries ({data.block.batch_summaries.length})
								</h2>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b bg-muted/30">
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Batch
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Tick Number
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Orders
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Cancels
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Batch Hash
											</th>
										</tr>
									</thead>
									<tbody>
										{data.block.batch_summaries.map((batch) => (
											<tr
												key={batch.index}
												className="border-b last:border-0 hover:bg-muted/5 transition-colors"
											>
												<td className="py-4 px-6">
													<span className="font-mono font-bold">
														#{batch.index}
													</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-mono tabular-nums">
														{formatNumber(batch.tick_number)}
													</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-mono font-semibold tabular-nums">
														{batch.order_count}
													</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-mono font-semibold tabular-nums">
														{batch.cancel_count}
													</span>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center gap-2">
														<span className="font-mono text-sm break-all flex-1">
															{batch.batch_hash}
														</span>
														<button
															type="button"
															onClick={() => copyToClipboard(batch.batch_hash)}
															className="p-2 hover:bg-muted transition-colors flex-shrink-0"
															aria-label="Copy batch hash"
														>
															<Copy className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Transactions */}
					{data.transactions.length > 0 && (
						<div className="border-t">
							<div className="px-6 py-3 bg-muted border-b">
								<h2 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
									Transactions ({data.transactions.length})
								</h2>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b bg-muted/30">
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Transaction ID
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Type
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Side
											</th>
											<th className="text-right py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Owner
											</th>
										</tr>
									</thead>
									<tbody>
										{data.transactions.map((tx) => (
											<tr
												key={tx.id}
												className="border-b last:border-0 hover:bg-muted/5 transition-colors"
											>
												<td className="py-4 px-6">
													<Link
														to="/transactions/$id"
														params={{ id: tx.id }}
														className="font-mono text-sm text-primary hover:underline inline-flex items-center gap-2 group/link"
													>
														{tx.id}
														<ArrowRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
													</Link>
												</td>
												<td className="py-4 px-6">
													<span className="font-medium capitalize">
														{tx.kind}
													</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-medium">{tx.side}</span>
												</td>
												<td className="py-4 px-6 text-right">
													<span className="font-mono text-sm text-muted-foreground">
														{tx.owner.substring(0, 8)}...
														{tx.owner.substring(tx.owner.length - 8)}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Events */}
					{data.events.length > 0 && (
						<div className="border-t">
							<div className="px-6 py-3 bg-muted border-b">
								<h2 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
									Events ({data.events.length})
								</h2>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b bg-muted/30">
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Event ID
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Market ID
											</th>
											<th className="text-left py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Applied Orders
											</th>
											<th className="text-right py-4 px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Batch Hash
											</th>
										</tr>
									</thead>
									<tbody>
										{data.events.map((event) => (
											<tr
												key={event.id}
												className="border-b last:border-0 hover:bg-muted/5 transition-colors"
											>
												<td className="py-4 px-6">
													<span className="font-mono text-sm">{event.id}</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-mono text-sm text-muted-foreground">
														{event.market_id.substring(0, 8)}...
													</span>
												</td>
												<td className="py-4 px-6">
													<span className="font-mono tabular-nums">
														{event.applied_orders}
													</span>
												</td>
												<td className="py-4 px-6 text-right">
													<span className="font-mono text-sm text-muted-foreground">
														{event.batch_hash.substring(0, 12)}...
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
