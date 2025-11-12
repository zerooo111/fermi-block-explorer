import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { TickResponse, RecentTicksResponse } from '../types/shared/api'
import { continuum_api } from "../../../src/lib/api";

export function useTick(tickNumber: number) {
  return useQuery({
    queryKey: ['tick', tickNumber],
    queryFn: async () => {
      const response = await axios.get<TickResponse>(continuum_api.TICK(tickNumber))
      return response.data
    },
    enabled: !!tickNumber && tickNumber > 0,
  })
}

export function useRecentTicks(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-ticks', limit],
    queryFn: async () => {
      const response = await axios.get<RecentTicksResponse>(continuum_api.TICKS({ limit }))
      return response.data
    },
    refetchInterval: 1000,
  })
}