import { lazy } from 'react'

const Simple = { Component: lazy(() => import('./Simple')) }
const Burst = { Component: lazy(() => import('./Burst')) }
const Color = { Component: lazy(() => import('./Color')) }
const RibbonBurst = { Component: lazy(() => import('./RibbonBurst')) }
const RibbonTest = { Component: lazy(() => import('./RibbonTest')) }
const Three = { Component: lazy(() => import('./Three')) }
const MultipleSystems = { Component: lazy(() => import('./MultipleSystems')) }

export {
    Simple,
    Burst,
    Color,
    RibbonBurst,
    RibbonTest,
    Three,
    MultipleSystems,
}
