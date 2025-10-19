// WebSocket hook for real-time block updates

import { useEffect, useState, useRef } from "react";
import { WS_BASE } from "@/lib/api";
import type { Block, WebSocketMessage } from "@/types/api";

interface UseBlockFeedResult {
	latestBlock: Block | null;
	isConnected: boolean;
	error: string | null;
}

export function useBlockFeed(): UseBlockFeedResult {
	const [latestBlock, setLatestBlock] = useState<Block | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectAttemptsRef = useRef(0);

	useEffect(() => {
		function connect() {
			try {
				const ws = new WebSocket(`${WS_BASE}/ws/blocks`);
				wsRef.current = ws;

				ws.onopen = () => {
					console.log("Connected to block feed");
					setIsConnected(true);
					setError(null);
					reconnectAttemptsRef.current = 0;
				};

				ws.onmessage = (event) => {
					try {
						const data: WebSocketMessage = JSON.parse(event.data);
						if (data.type === "new_block") {
							setLatestBlock(data.block);
						}
					} catch (err) {
						console.error("Failed to parse WebSocket message:", err);
					}
				};

				ws.onerror = (event) => {
					console.error("WebSocket error:", event);
					setError("WebSocket connection error");
					setIsConnected(false);
				};

				ws.onclose = () => {
					console.log("Disconnected from block feed");
					setIsConnected(false);

					// Attempt to reconnect with exponential backoff
					reconnectAttemptsRef.current += 1;
					const delay = Math.min(
						1000 * 2 ** reconnectAttemptsRef.current,
						30000,
					);

					console.log(
						`Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptsRef.current})`,
					);

					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, delay);
				};
			} catch (err) {
				console.error("Failed to create WebSocket connection:", err);
				setError("Failed to create WebSocket connection");
			}
		}

		connect();

		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	return { latestBlock, isConnected, error };
}
