import { lazy } from 'react'

const Simple = { Component: lazy(() => import('./Simple')) }
const Burst = { Component: lazy(() => import('./Burst')) }
const Color = { Component: lazy(() => import('./Color')) }
const Emit = { Component: lazy(() => import('./Emit')) }
const EmitBurst = { Component: lazy(() => import('./EmitBurst')) }
const RibbonBurst = { Component: lazy(() => import('./RibbonBurst')) }
const RibbonTest = { Component: lazy(() => import('./RibbonTest')) }
const Three = { Component: lazy(() => import('./Three')) }
const Size = { Component: lazy(() => import('./Size')) }

export {
    Simple,
    Burst,
    Color,
    Emit,
    EmitBurst,
    RibbonBurst,
    RibbonTest,
    Three,
    Size,
}
