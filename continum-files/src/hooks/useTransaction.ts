import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { TransactionResponse } from '../types/shared/api'
import { continuum_api } from "../../../src/lib/api";

export function useTransaction(hash: string) {
  return useQuery({
    queryKey: ['transaction', hash],
    queryFn: async () => {
      const response = await axios.get<TransactionResponse>(continuum_api.TX(hash))
      return response.data
    },
    enabled: !!hash,
  })
}