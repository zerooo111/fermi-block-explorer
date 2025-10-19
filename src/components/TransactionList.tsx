import { Link } from "@tanstack/react-router";
import type { Transaction } from "@/types/api";
import {
	truncateAddress,
	formatPrice,
	formatQuantity,
	getMintDecimals,
} from "@/lib/formatters";

interface TransactionListProps {
	transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
	if (transactions.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				No transactions found
			</div>
		);
	}

	return (
		<div className="rounded-lg border overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-muted/50 border-b">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Transaction ID
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Type
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Market
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Owner
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Details
							</th>
						</tr>
					</thead>
					<tbody className="bg-card divide-y">
						{transactions.map((tx) => {
							const owner = tx.order?.owner || tx.cancel?.owner || "";
							const marketName =
								tx.order?.market_name || tx.cancel?.market_name || "";

							return (
								<tr key={tx.id} className="hover:bg-muted/20">
									<td className="px-4 py-3">
										<Link
											to="/transactions/$id"
											params={{ id: tx.id }}
											className="font-mono text-sm hover:underline"
										>
											{truncateAddress(tx.id, 8, 8)}
										</Link>
									</td>
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												tx.kind === "Order"
													? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
													: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
											}`}
										>
											{tx.kind}
										</span>
									</td>
									<td className="px-4 py-3 text-sm font-medium">
										{marketName}
									</td>
									<td className="px-4 py-3">
										<Link
											to="/address/$pubkey"
											params={{ pubkey: owner }}
											className="font-mono text-sm hover:underline"
										>
											{truncateAddress(owner, 6, 6)}
										</Link>
									</td>
									<td className="px-4 py-3 text-sm">
										{tx.kind === "Order" && tx.order && (
											<div className="flex flex-col gap-1">
												<span
													className={
														tx.order.side === "Buy"
															? "text-green-600 dark:text-green-400 font-medium"
															: "text-red-600 dark:text-red-400 font-medium"
													}
												>
													{tx.order.side}
												</span>
												<span>
													{formatQuantity(
														tx.order.quantity,
														getMintDecimals(tx.order.base_mint),
													)}{" "}
													@ {formatPrice(tx.order.price, 6)}
												</span>
											</div>
										)}
										{tx.kind === "Cancel" && tx.cancel && (
											<span className="font-mono text-xs">
												{truncateAddress(tx.cancel.order_id, 8, 8)}
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
