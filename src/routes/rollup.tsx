import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/pages/rollupPage'

export const Route = createFileRoute('/rollup')({
  component: Dashboard,
})
