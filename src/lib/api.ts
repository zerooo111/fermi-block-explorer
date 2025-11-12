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
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL
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

export const rollup_api = {
	getStatus: (): Promise<NodeStatus> => fetchAPI<NodeStatus>("/api/v1/rollup/status"),
	getMarkets: (): Promise<MarketsResponse> =>
		fetchAPI<MarketsResponse>("/api/v1/rollup/markets"),
	getLatestBlock: (): Promise<BlockWithDetails> =>
		fetchAPI<BlockWithDetails>("/api/v1/rollup/blocks/latest"),
	getBlock: (height: number): Promise<BlockWithDetails> =>
		fetchAPI<BlockWithDetails>(`/api/v1/rollup/blocks/${height}`),
	getBlocks: async (limit = 20, offset = 0): Promise<BlocksListResponse> => {
		const blocks = await fetchAPI<Block[]>(
			`/api/v1/rollup/blocks?limit=${limit}&offset=${offset}`,
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
		fetchAPI<Transaction>(`/api/v1/rollup/transactions/${id}`),
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
		return fetchAPI<EventsResponse>(`/api/v1/rollup/events?${params.toString()}`);
	},
};



export const continuum_api = {
  getStatus: () => fetchAPI("/health"),
  STATUS: `${API_BASE_URL}/api/v1/continuum/status`,
  TICK: (tickNumber: number) => `${API_BASE_URL}/api/v1/continuum/tick/${tickNumber}`,
  TICKS: (params?: { limit?: number }) => {
	const search = new URLSearchParams();
	if (params?.limit !== undefined) search.set('limit', String(params.limit));
	const qs = search.toString();
	return `${API_BASE_URL}/api/v1/continuum/ticks${qs ? `?${qs}` : ''}`;
  },
  RECENT_TICKS: (limit: number) => `${API_BASE_URL}/api/v1/continuum/ticks/recent?limit=${limit}`,
  TX: (hash: string) => `${API_BASE_URL}/api/v1/continuum/tx/${hash}`,
  RECENT_TX: (limit: number) => `${API_BASE_URL}/api/v1/continuum/tx/recent?limit=${limit}`,
  STREAM_TICKS: (params?: { start_tick?: number }) => {
	const search = new URLSearchParams();
	if (params?.start_tick !== undefined) search.set('start_tick', String(params.start_tick));
	const qs = search.toString();
	return `${API_BASE_URL}/api/v1/continuum/stream-ticks${qs ? `?${qs}` : ''}`;
  },
} as const;

export type ApiRouteValue = typeof continuum_api[keyof typeof continuum_api];
