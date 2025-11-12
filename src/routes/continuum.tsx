import { createFileRoute } from '@tanstack/react-router'
import Homepage from '../../../fermi-explorer-fronend/src/pages/Homepage'

export const Route = createFileRoute('/continuum')({
  component: Homepage,
})
