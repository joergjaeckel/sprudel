import {
  ColorKeyframeTrack,
  Interpolant,
  InterpolateLinear,
  KeyframeTrack,
  NumberKeyframeTrack,
  Vector3,
} from 'three'

export * from './ParticleGeometry'
export * from './ParticleMaterial'
export * from './ParticleSystem'
export * from './RibbonGeometry'
export * from './RibbonMaterial'
export * from './systems'

export type Burst = {
  count: number
  cycleCount: number
  repeatInterval: number
  time: number
}

export type RuntimeBurst = Burst & {
  cycle: number
}

export const defaultBurst = {
  count: 10,
  cycleCount: -1,
  repeatInterval: 1,
  time: 0,

  /* Internal */
  cycle: 0,
}

export interface IGeneric {
  value: number[]
  interpolant?: Interpolant
  keyframes?: KeyframeTrack
  customFn?: (delta: number) => void
}

export type Particle = {
  hideParticle?: boolean

  color?: IGeneric | [number, number, number]
  colorOverLifetime?: ColorKeyframeTrack

  size?: IGeneric | number
  sizeOverLifetime?: NumberKeyframeTrack

  opacity?: IGeneric | number
  opacityOverLifetime?: NumberKeyframeTrack

  startDelay?: number
  startLifetime?: number
  startSpeed?: number
  startPosition?: [number, number, number]
  startRotation?: [number, number, number]

  rateOverTime?: number

  randomizePosition?: number
  randomizeRotation?: number
  randomizeSpeed?: number
  randomizeLifetime?: number

  mass?: number

  linewidth?: number
  ribbon?: boolean

  sprite?: number

  inheritVelocity?: boolean

  speed?: number
  speedModifier?: number

  emitting?: Particle[]
  bursts?: Burst[]

  position?: Vector3
  parent?: number
}

export type RuntimeParticle = Particle & {
  id: number

  particle?: boolean
  hideParticle?: boolean

  color: IGeneric
  colorOverLifetime?: ColorKeyframeTrack

  size: IGeneric
  sizeOverLifetime?: NumberKeyframeTrack

  opacity: IGeneric
  opacityOverLifetime?: NumberKeyframeTrack

  startDelay: number
  startLifetime: number
  startSpeed: number
  startPosition: [number, number, number]
  startRotation: [number, number, number]

  rateOverTime: number

  randomizePosition: number
  randomizeRotation: number
  randomizeSpeed: number
  randomizeLifetime: number

  mass: number

  sprite?: number

  inheritVelocity?: boolean

  speed: number
  speedModifier: number

  emitting?: RuntimeParticle[]
  bursts?: RuntimeBurst[]

  /* Emitting specific */
  accumulate: number

  /* Internals */
  remainingLifetime: number
  operationalLifetime: number
  position: Vector3
  velocity: Vector3
  parent: number | undefined
}

export const defaultParticle = {
  particle: true,

  size: { value: [1] },
  opacity: { value: [1] },
  color: { value: [1, 1, 1] },

  //duration: 2,
  //looping: false,
  //prewarm: false,
  startDelay: 0,

  startLifetime: -1,
  startSpeed: 1,
  startPosition: [0, 0, 0],
  startRotation: [0, 0, 0],
  //flipRotation: false,
  //gravityModifier: 0,

  rateOverTime: 1,
  //rateOverDistance: 0,

  //velocityOverLifetime
  speedModifier: 0.95,

  randomizeLifetime: 0,
  randomizeSpeed: 0,
  randomizePosition: 0,
  randomizeRotation: 0,

  mass: 1,

  sprite: 0,

  inheritVelocity: false,

  /* Created for internal usage */
  remainingLifetime: 1,
  operationalLifetime: 0,
  position: new Vector3(),
  accumulate: 0,
}

export const validateBurst = (burst: Burst): RuntimeBurst => {
  return Object.assign({}, defaultBurst, burst)
}

const evalKeys = ['size', 'color', 'opacity']

let nextParticleId = 1

export const validateParticle = (entity: Particle | RuntimeParticle): RuntimeParticle => {
  const e = Object.assign({}, defaultParticle, entity) as RuntimeParticle

  e.id = nextParticleId++

  evalKeys.map((key) => {
    const component = entity[`${key}OverLifetime` as keyof Particle]

    /* parse static color from array */
    // @ts-ignore non-changing color
    if (Array.isArray(entity[key])) e[key] = { value: entity[key] }

    /* parse static opacity or size from number */
    // @ts-ignore
    if (typeof entity[key] === 'number') e[key] = { value: [entity[key]] }

    /* parse dynamic ...OverLifetime props from KeyframeTrack */
    if (component && component instanceof KeyframeTrack) {
      component.setInterpolation(InterpolateLinear)

      //@ts-ignore
      e[key].interpolant = component.createInterpolant()

      // @ts-ignore
      e[key].keyframes = component

      // @ts-ignore
      e[key].value = e[key].interpolant.evaluate(0)
    }
  })

  if (entity.startLifetime) e.remainingLifetime = entity.startLifetime

  if (entity.bursts) e.bursts = entity.bursts?.map((burst) => validateBurst(burst))

  if (entity.emitting) e.emitting = entity.emitting?.map((emitter: Particle) => validateParticle(emitter))

  if (e.hideParticle) delete e.particle

  return e
}
