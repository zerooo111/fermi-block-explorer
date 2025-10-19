import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import { useTransaction } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { formatPrice, formatQuantity } from "@/lib/formatters";

export const Route = createFileRoute("/transactions/$id")({
	component: TransactionDetailPage,
});

function TransactionDetailPage() {
	const { id } = Route.useParams();
	const { data: transaction, isLoading, error } = useTransaction(id);

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

	if (!transaction) {
		return (
			<div className="container mx-auto px-6 py-8 max-w-7xl">
				<ErrorMessage message="Transaction not found" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 py-12 max-w-7xl">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/blocks/$height"
						params={{ height: transaction.block_height.toString() }}
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
					>
						<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						Back to Block
					</Link>
					<h1 className="text-4xl font-bold mb-2 tracking-tight">
						Transaction Details
					</h1>
					<p className="text-lg text-muted-foreground">
						Transaction ID: {transaction.id}
					</p>
				</div>

				{/* Main Content Container */}
				<div className="border">
					{/* Overview */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Block Height
							</p>
							<Link
								to="/blocks/$height"
								params={{ height: transaction.block_height.toString() }}
								className="text-4xl font-bold font-mono tabular-nums text-primary hover:underline"
							>
								{transaction.block_height.toLocaleString()}
							</Link>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Type
							</p>
							<p className="text-4xl font-bold capitalize">
								{transaction.kind}
							</p>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Side
							</p>
							<p className="text-4xl font-bold">{transaction.side}</p>
						</div>
						<div className="bg-background p-8">
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
								Batch Index
							</p>
							<p className="text-4xl font-bold font-mono tabular-nums">
								{transaction.batch_index}
							</p>
						</div>
					</div>

					{/* Transaction ID */}
					<div className="border-t p-6">
						<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
							Transaction ID
						</h2>
						<div className="flex items-start justify-between gap-4">
							<p className="font-mono text-sm break-all flex-1">
								{transaction.id}
							</p>
							<button
								type="button"
								onClick={() => copyToClipboard(transaction.id)}
								className="p-2 hover:bg-muted transition-colors flex-shrink-0"
								aria-label="Copy transaction ID"
							>
								<Copy className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Signature */}
					<div className="border-t p-6">
						<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
							Signature
						</h2>
						<div className="flex items-start justify-between gap-4">
							<p className="font-mono text-sm break-all flex-1">
								{transaction.signature}
							</p>
							<button
								type="button"
								onClick={() => copyToClipboard(transaction.signature)}
								className="p-2 hover:bg-muted transition-colors flex-shrink-0"
								aria-label="Copy signature"
							>
								<Copy className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Order Details */}
					{transaction.kind === "order" && (
						<div className="border-t">
							<div className="px-6 pt-6 pb-4">
								<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
									Order Details
								</h2>
							</div>
							<div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Order ID
									</p>
									<p className="font-mono text-sm">{transaction.order_id}</p>
								</div>
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Market
									</p>
									<p className="font-mono text-sm">
										{transaction.market_name || "N/A"}
									</p>
								</div>
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Price
									</p>
									<p className="font-mono text-sm font-semibold">
										{formatPrice(transaction.price)}
									</p>
								</div>
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Quantity
									</p>
									<p className="font-mono text-sm font-semibold">
										{formatQuantity(transaction.quantity)}
									</p>
								</div>
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Base Mint
									</p>
									<p className="font-mono text-xs break-all">
										{transaction.base_mint}
									</p>
								</div>
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Quote Mint
									</p>
									<p className="font-mono text-xs break-all">
										{transaction.quote_mint}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Owner */}
					<div className="border-t p-6">
						<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
							Owner
						</h2>
						<div className="flex items-start justify-between gap-4">
							<p className="font-mono text-sm break-all flex-1">
								{transaction.owner}
							</p>
							<button
								type="button"
								onClick={() => copyToClipboard(transaction.owner)}
								className="p-2 hover:bg-muted transition-colors flex-shrink-0"
								aria-label="Copy owner address"
							>
								<Copy className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Additional Info */}
					<div className="border-t p-6">
						<h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
							Additional Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
									Continuum Sequence
								</p>
								<p className="font-mono text-sm">
									{transaction.continuum_sequence}
								</p>
							</div>
							<div>
								<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
									Timestamp
								</p>
								<p className="font-mono text-sm">
									{new Date(transaction.timestamp_ms).toLocaleString()}
								</p>
							</div>
							{transaction.market_id && (
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Market ID
									</p>
									<p className="font-mono text-xs break-all">
										{transaction.market_id}
									</p>
								</div>
							)}
							{transaction.market_kind && (
								<div>
									<p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
										Market Kind
									</p>
									<p className="font-mono text-sm capitalize">
										{transaction.market_kind}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
