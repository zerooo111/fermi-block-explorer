import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBlocks } from "@/hooks/useApi";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
	formatRelativeTime,
	formatTimestamp,
	truncateAddress,
} from "@/lib/formatters";

export const Route = createFileRoute("/blocks/")({
	component: BlocksPage,
});

function BlocksPage() {
	const [page, setPage] = useState(0);
	const limit = 20;

	const { data, isLoading, error } = useBlocks(limit, page * limit);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
				<ErrorMessage message={(error as Error).message} />
			</div>
		);
	}

	const totalPages = data ? Math.ceil(data.total / limit) : 0;

	return (
		<div className="min-h-screen bg-background pb-8">
			<div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
				<div className="mb-6 sm:mb-8">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
					>
						<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						Back to Dashboard
					</Link>
					<h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">All Blocks</h1>
					<p className="text-base sm:text-lg text-muted-foreground">
						Browse all blocks on the Fermi rollup
					</p>
				</div>

				{data?.blocks && data.blocks.length > 0 ? (
					<>
						<div className="border mb-8">
							<div className="overflow-x-auto">
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
											<th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
												State Root
											</th>
										</tr>
									</thead>
									<tbody>
										{data.blocks.map((block) => {
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
						</div>

						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</>
				) : (
					<ErrorMessage message="No blocks found" />
				)}
			</div>
		</div>
	);
}
