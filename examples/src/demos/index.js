import { lazy } from 'react'

const Simple = { Component: lazy(() => import('./Simple')) }
const Burst = { Component: lazy(() => import('./Burst')) }
const Color = { Component: lazy(() => import('./Color')) }
const Emit = { Component: lazy(() => import('./Emit')) }
const EmitBurst = { Component: lazy(() => import('./EmitBurst')) }

export {
    Simple,
    Burst,
    Color,
    Emit,
    EmitBurst,
}
