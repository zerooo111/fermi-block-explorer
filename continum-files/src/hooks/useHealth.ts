import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { HealthResponse } from '../types/shared/api'
import { continuum_api } from "../../../src/lib/api";

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get<HealthResponse>(continuum_api.HEALTH)
      return response.data
    },
    refetchInterval: 5000,
  })
}
