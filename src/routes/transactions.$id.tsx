import { createFileRoute, Link } from "@tanstack/react-router";
import { useTransaction } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
	truncateAddress,
	parseTransactionId,
	formatPrice,
	formatQuantity,
	getMintDecimals,
} from "@/lib/formatters";

export const Route = createFileRoute("/transactions/$id")({
	component: TransactionDetailPage,
});

function TransactionDetailPage() {
	const { id } = Route.useParams();
	const { data: transaction, isLoading, error } = useTransaction(id);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<ErrorMessage message={(error as Error).message} />
			</div>
		);
	}

	if (!transaction) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<ErrorMessage message="Transaction not found" />
			</div>
		);
	}

	const parsedId = parseTransactionId(transaction.id);

	return (
		<div className="container mx-auto px-4 max-w-7xl pb-8">
			{/* Transaction Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Transaction Details</h1>
				<p className="text-muted-foreground font-mono text-sm break-all">
					{transaction.id}
				</p>
			</div>

			{/* Transaction Type Badge */}
			<div className="mb-6">
				<span
					className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
						transaction.kind === "Order"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
							: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
					}`}
				>
					{transaction.kind}
				</span>
			</div>

			{/* Transaction Information */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-lg font-semibold mb-4">General Information</h2>
					<dl className="space-y-3">
						<div>
							<dt className="text-sm text-muted-foreground">Block Height</dt>
							<dd>
								<Link
									to="/blocks/$height"
									params={{ height: transaction.block_height.toString() }}
									className="font-mono hover:underline"
								>
									{transaction.block_height.toLocaleString()}
								</Link>
							</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">Batch Index</dt>
							<dd className="font-mono">{parsedId.batchIndex}</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">
								Transaction Index
							</dt>
							<dd className="font-mono">{parsedId.txIndex}</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">
								Continuum Sequence
							</dt>
							<dd className="font-mono">
								{transaction.continuum_sequence.toLocaleString()}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">Signature</dt>
							<dd className="font-mono text-sm break-all">
								{truncateAddress(transaction.signature, 16, 16)}
							</dd>
						</div>
					</dl>
				</div>

				{/* Order/Cancel Specific Details */}
				{transaction.kind === "Order" && transaction.order && (
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Order Details</h2>
						<dl className="space-y-3">
							<div>
								<dt className="text-sm text-muted-foreground">Order ID</dt>
								<dd className="font-mono text-sm break-all">
									{truncateAddress(transaction.order.order_id, 16, 16)}
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Market</dt>
								<dd>
									<Link
										to="/markets/$id"
										params={{ id: transaction.order.market_id }}
										className="hover:underline"
									>
										{transaction.order.market_name}
									</Link>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Side</dt>
								<dd>
									<span
										className={`font-medium ${
											transaction.order.side === "Buy"
												? "text-green-600 dark:text-green-400"
												: "text-red-600 dark:text-red-400"
										}`}
									>
										{transaction.order.side}
									</span>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Price</dt>
								<dd className="font-mono">
									{formatPrice(transaction.order.price, 6)} USDC
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Quantity</dt>
								<dd className="font-mono">
									{formatQuantity(
										transaction.order.quantity,
										getMintDecimals(transaction.order.base_mint),
									)}
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Owner</dt>
								<dd>
									<Link
										to="/address/$pubkey"
										params={{ pubkey: transaction.order.owner }}
										className="font-mono text-sm hover:underline break-all"
									>
										{truncateAddress(transaction.order.owner, 12, 12)}
									</Link>
								</dd>
							</div>
						</dl>
					</div>
				)}

				{transaction.kind === "Cancel" && transaction.cancel && (
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Cancel Details</h2>
						<dl className="space-y-3">
							<div>
								<dt className="text-sm text-muted-foreground">
									Cancelled Order ID
								</dt>
								<dd className="font-mono text-sm break-all">
									{truncateAddress(transaction.cancel.order_id, 16, 16)}
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Market</dt>
								<dd>
									<Link
										to="/markets/$id"
										params={{ id: transaction.cancel.market_id }}
										className="hover:underline"
									>
										{transaction.cancel.market_name}
									</Link>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Owner</dt>
								<dd>
									<Link
										to="/address/$pubkey"
										params={{ pubkey: transaction.cancel.owner }}
										className="font-mono text-sm hover:underline break-all"
									>
										{truncateAddress(transaction.cancel.owner, 12, 12)}
									</Link>
								</dd>
							</div>
						</dl>
					</div>
				)}
			</div>

			{/* Mint Information for Orders */}
			{transaction.kind === "Order" && transaction.order && (
				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-lg font-semibold mb-4">Token Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<dt className="text-sm text-muted-foreground mb-1">Base Mint</dt>
							<dd className="font-mono text-sm break-all">
								{transaction.order.base_mint}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground mb-1">Quote Mint</dt>
							<dd className="font-mono text-sm break-all">
								{transaction.order.quote_mint}
							</dd>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
