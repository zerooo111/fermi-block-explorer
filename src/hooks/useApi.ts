// React Query hooks for API integration

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	NodeStatus,
	MarketsResponse,
	BlockWithDetails,
	BlocksListResponse,
	Transaction,
	EventsResponse,
} from "@/types/api";

// Node status
export function useStatus() {
	return useQuery<NodeStatus>({
		queryKey: ["status"],
		queryFn: () => api.getStatus(),
		refetchInterval: 5000, // Poll every 5 seconds
	});
}

// Markets
export function useMarkets() {
	return useQuery<MarketsResponse>({
		queryKey: ["markets"],
		queryFn: () => api.getMarkets(),
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
}

// Latest block
export function useLatestBlock() {
	return useQuery<BlockWithDetails>({
		queryKey: ["blocks", "latest"],
		queryFn: () => api.getLatestBlock(),
		refetchInterval: 1000, // Poll every second for real-time feel
	});
}

// Specific block by height
export function useBlock(height: number | undefined) {
	return useQuery<BlockWithDetails>({
		queryKey: ["blocks", height],
		queryFn: () => {
			if (height === undefined) {
				throw new Error("Block height is required");
			}
			return api.getBlock(height);
		},
		enabled: height !== undefined,
	});
}

// Block list with pagination
export function useBlocks(limit = 20, offset = 0) {
	return useQuery<BlocksListResponse>({
		queryKey: ["blocks", { limit, offset }],
		queryFn: () => api.getBlocks(limit, offset),
		refetchInterval: 3000, // Poll every 3 seconds for block list updates
	});
}

// Specific transaction
export function useTransaction(id: string | undefined) {
	return useQuery<Transaction>({
		queryKey: ["transactions", id],
		queryFn: () => {
			if (!id) {
				throw new Error("Transaction ID is required");
			}
			return api.getTransaction(id);
		},
		enabled: !!id,
		retry: (failureCount, error) => {
			// Don't retry 404s
			if (error.message === "Resource not found") return false;
			return failureCount < 3;
		},
	});
}

// Events with optional market filter
export function useEvents(marketId?: string, limit = 20, offset = 0) {
	return useQuery<EventsResponse>({
		queryKey: ["events", { marketId, limit, offset }],
		queryFn: () => api.getEvents(marketId, limit, offset),
	});
}
