import { createFileRoute } from '@tanstack/react-router'
import Homepage from '../../continum-files/src/pages/Homepage'

export const Route = createFileRoute('/continuum')({
  component: Homepage,
})
