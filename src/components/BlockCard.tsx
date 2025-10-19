import { Link } from "@tanstack/react-router";
import type { Block } from "@/types/api";
import {
	formatTimestamp,
	formatRelativeTime,
	truncateAddress,
} from "@/lib/formatters";
import { ArrowRight, FileText, ShoppingCart, X } from "lucide-react";

interface BlockCardProps {
	block: Block;
}

export function BlockCard({ block }: BlockCardProps) {
	const stateRootHex = block.state_root
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return (
		<div className="bg-background border-t hover:bg-muted/5 transition-colors group">
			<div className="p-8">
				<div className="flex items-start justify-between mb-6">
					<div className="flex-1">
						<Link
							to="/blocks/$height"
							params={{ height: block.height.toString() }}
							className="inline-flex items-center gap-2 group/link"
						>
							<span className="text-2xl font-bold font-mono tabular-nums group-hover/link:text-primary transition-colors">
								#{block.height.toLocaleString()}
							</span>
							<ArrowRight className="h-5 w-5 text-muted-foreground group-hover/link:text-primary transition-all group-hover/link:translate-x-1" />
						</Link>
						<div className="flex items-center gap-3 mt-2">
							<p className="text-sm font-mono text-muted-foreground">
								{formatTimestamp(block.produced_at)}
							</p>
							<span className="text-muted-foreground/50">·</span>
							<p className="text-sm text-muted-foreground">
								{formatRelativeTime(block.produced_at)}
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-8 mb-6">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Transactions
							</p>
						</div>
						<p className="text-2xl font-bold font-mono tabular-nums">
							{block.transaction_ids.length}
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<ShoppingCart className="h-4 w-4 text-muted-foreground" />
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Orders
							</p>
						</div>
						<p className="text-2xl font-bold font-mono tabular-nums">
							{block.total_orders}
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<X className="h-4 w-4 text-muted-foreground" />
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Cancels
							</p>
						</div>
						<p className="text-2xl font-bold font-mono tabular-nums">
							{block.total_cancels}
						</p>
					</div>
				</div>

				<div className="pt-6 border-t">
					<p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
						State Root
					</p>
					<p className="font-mono text-sm text-foreground/60 break-all">
						{truncateAddress(stateRootHex, 20, 20)}
					</p>
				</div>
			</div>
		</div>
	);
}
