// API Client for Fermi Block Explorer

import type {
	NodeStatus,
	MarketsResponse,
	BlockWithDetails,
	BlocksListResponse,
	Transaction,
	EventsResponse,
	Block,
} from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE ;

export const WS_BASE = import.meta.env.VITE_WS_BASE ;

async function fetchAPI<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`);

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error("Resource not found");
		}
		throw new Error(`API error: ${response.statusText}`);
	}

	return response.json();
}

export const api = {
	getStatus: (): Promise<NodeStatus> => fetchAPI<NodeStatus>("/status"),
	getMarkets: (): Promise<MarketsResponse> =>
		fetchAPI<MarketsResponse>("/markets"),
	getLatestBlock: (): Promise<BlockWithDetails> =>
		fetchAPI<BlockWithDetails>("/blocks/latest"),
	getBlock: (height: number): Promise<BlockWithDetails> =>
		fetchAPI<BlockWithDetails>(`/blocks/${height}`),
	getBlocks: async (limit = 20, offset = 0): Promise<BlocksListResponse> => {
		const blocks = await fetchAPI<Block[]>(
			`/blocks?limit=${limit}&offset=${offset}`,
		);
		// API returns an array directly, wrap it in the expected format
		return {
			blocks,
			total: blocks.length, // Note: API doesn't provide total count
			limit,
			offset,
		};
	},
	getTransaction: (id: string): Promise<Transaction> =>
		fetchAPI<Transaction>(`/transactions/${id}`),
	getEvents: (
		marketId?: string,
		limit = 20,
		offset = 0,
	): Promise<EventsResponse> => {
		const params = new URLSearchParams({
			limit: limit.toString(),
			offset: offset.toString(),
		});
		if (marketId) {
			params.append("market_id", marketId);
		}
		return fetchAPI<EventsResponse>(`/events?${params.toString()}`);
	},
};
