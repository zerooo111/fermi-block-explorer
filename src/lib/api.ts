// API Client for Fermi Block Explorer

import type { Block } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const WS_BASE = import.meta.env.VITE_WS_BASE || "ws://localhost:8080";

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
	getStatus: () => fetchAPI("/status"),
	getMarkets: () => fetchAPI("/markets"),
	getLatestBlock: () => fetchAPI("/blocks/latest"),
	getBlock: (height: number) => fetchAPI(`/blocks/${height}`),
	getBlocks: async (limit = 20, offset = 0) => {
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
	getTransaction: (id: string) => fetchAPI(`/transactions/${id}`),
	getEvents: (marketId?: string, limit = 20, offset = 0) => {
		const params = new URLSearchParams({
			limit: limit.toString(),
			offset: offset.toString(),
		});
		if (marketId) {
			params.append("market_id", marketId);
		}
		return fetchAPI(`/events?${params.toString()}`);
	},
};
