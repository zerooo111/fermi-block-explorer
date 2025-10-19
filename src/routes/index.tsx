import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useBlocks, useLatestBlock, useStatus } from "@/hooks/useApi";
import {
	formatRelativeTime,
	formatTimestamp,
	truncateAddress,
} from "@/lib/formatters";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

function Dashboard() {
	const { data: status, isLoading: statusLoading } = useStatus();
	const { data: blocksData, isLoading: blocksLoading } = useBlocks(10, 0);
	const { data: latestBlock, isLoading: latestBlockLoading } = useLatestBlock();

	if (statusLoading || blocksLoading || latestBlockLoading) {
		return <LoadingSpinner />;
	}

	const isLive = !statusLoading && !latestBlockLoading;

	return (
		<div className="min-h-screen bg-muted/50 pb-8">
			{/* Hero Section */}
				<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
					<h1 className="text-3xl sm:text-4xl tracking-tight">
						Fermi Rollup Explorer
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
						Real-time blockchain explorer for the Fermi rollup network
					</p>
				</div>

			<div className="container mx-auto px-4 sm:px-6 mb-8 max-w-7xl">
				{/* Main Content Container */}
				<div className="border">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 divide-y md:divide-x md:divide-y-0 md:grid-cols-2 gap-px">
						<div className="p-4 sm:p-6 bg-white">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
									Latest Block
								</p>
								<div className="flex items-center gap-2">
									<div
										className={`h-2 w-2 ${isLive ? "bg-green-500" : "bg-gray-500"}`}
									/>
									<span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
										{isLive ? "Live" : "..."}
									</span>
								</div>
							</div>
							<NumberFlow
								value={
									latestBlock?.block.height ?? status?.block_height ?? 0
								}
								format={{ notation: "standard" }}
								className="text-3xl sm:text-4xl font-bold font-mono tabular-nums"
							/>
						</div>

						<div className="bg-background p-4 sm:p-6">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Applied Batches
							</p>
							<NumberFlow
								value={status?.applied_batches ?? 0}
								format={{ notation: "standard" }}
								className="text-3xl sm:text-4xl font-bold font-mono tabular-nums"
							/>
						</div>
					</div>

					{/* Latest Blocks Table */}
					<div className="border-t bg-muted">
						<div className="px-4 sm:px-6 py-3 sm:py-4 border-b font-bold flex items-center justify-between">
							<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Latest Blocks
							</h2>
							<Link
								to="/blocks"
								className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider inline-flex items-center gap-2 group"
							>
								View all
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>

						{blocksData?.blocks && blocksData.blocks.length > 0 ? (
							<div className="overflow-x-auto bg-white">
								<table className="w-full">
									<thead>
										<tr className="border-b bg-muted/30">
											<th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Block
											</th>
											<th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Time
											</th>
											<th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Txs
											</th>
											<th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Orders
											</th>
											<th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												Cancels
											</th>
											<th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
												State Root
											</th>
										</tr>
									</thead>
									<tbody>
										{blocksData.blocks.slice(0, 10).map((block) => {
											const stateRootHex = block.state_root
												.map((b) => b.toString(16).padStart(2, "0"))
												.join("");
											return (
												<tr
													key={block.height}
													className="border-b last:border-0 hover:bg-muted/5 transition-colors"
												>
													<td className="py-3 sm:py-4 px-3 sm:px-6">
														<Link
															to="/blocks/$height"
															params={{ height: block.height.toString() }}
															className="font-mono font-bold text-sm sm:text-base text-primary hover:underline inline-flex items-center gap-2 group/link"
														>
															#{block.height.toLocaleString()}
															<ArrowRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
														</Link>
													</td>
													<td className="py-3 sm:py-4 px-3 sm:px-6">
														<div className="space-y-1">
															<p className="text-xs sm:text-sm font-mono text-foreground">
																{formatTimestamp(block.produced_at)}
															</p>
															<p className="text-xs text-muted-foreground">
																{formatRelativeTime(block.produced_at)}
															</p>
														</div>
													</td>
													<td className="py-3 sm:py-4 px-3 sm:px-6">
														<span className="font-mono text-sm font-semibold tabular-nums">
															{block.transaction_ids.length}
														</span>
													</td>
													<td className="py-3 sm:py-4 px-3 sm:px-6">
														<span className="font-mono text-sm font-semibold tabular-nums">
															{block.total_orders}
														</span>
													</td>
													<td className="py-3 sm:py-4 px-3 sm:px-6">
														<span className="font-mono text-sm font-semibold tabular-nums">
															{block.total_cancels}
														</span>
													</td>
													<td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
														<span className="font-mono text-xs sm:text-sm text-muted-foreground">
															{truncateAddress(stateRootHex, 8, 8)}
														</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<div className="p-4 sm:p-6">
								<ErrorMessage message="No blocks found" />
							</div>
						)}
					</div>

					{/* State Root Display */}
					{status?.state_root && (
						<div className="border-t p-4 sm:p-6">
							<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
								Current State Root
							</h2>
							<p className="font-mono text-xs sm:text-sm break-all text-foreground/80">
								{status.state_root
									.map((b) => b.toString(16).padStart(2, "0"))
									.join("")}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
