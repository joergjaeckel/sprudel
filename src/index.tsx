import {World} from 'miniplex'
import {ColorKeyframeTrack, Interpolant, Vector3} from "three";

export const world = new World()

export const movingEntities = world.archetype("speed");
export const livingEntities = world.archetype("startLifetime");

export const particleEntities = world.archetype("particle");
export const emittingEntities = world.archetype("emitting");
export const ribbonEntities = world.archetype("ribbon");

export * from './ParticleGeometry'
export * from './ParticleMaterial'

export * from './RibbonRenderer'

export * from './systems'

export type Burst = {
    count: number
    cycleCount: number
    repeatInterval: number
    time: number
}

export const defaultBurst = {
    count: 10,
    cycleCount: -1,
    repeatInterval: 1,
    time: 0,

    /* Internal */
    cycle: 0,
}

export type Particle = {
    particle?: boolean
    //duration: 2,
    //looping: false,
    //prewarm: false,
    startDelay: number

    startLifetime: number
    startSpeed: number
    startSize: number
    startPosition: [number, number, number]
    startRotation: [number, number, number]
    //flipRotation: false,
    startColor: [number, number, number]
    //gravityModifier: 0,

    rateOverTime: number
    //rateOverDistance: 0,

    //velocityOverLifetime
    //speedModifier: { evaluate: (t: number) => t },

    randomizePosition: number
    randomizeDirection: number
    randomizeSpeed: number
    randomizeLifetime: number

    //sizeOverLifetime: bezier(),
    mass: number
    //colorOverLifetime: (t) => ({r: Math.pow(1 - t / 3, 9) + 0.1, g: 0.1, b: 0.1}),
    //opacityOverLifetime: (t) => (1 - t / 3) * 0.4,
    //sizeFunction: (t) => smoke.initialSize + 10 * smoke.sizeFunction.evaluate(t)

    sprite: number

    inheritVelocity: boolean

    emitting?: Particle[]
    bursts?: Burst[]
    colorOverLifetime?: ColorKeyframeTrack
    colorInterpolant?: Interpolant
    color: [number, number, number]
    remaininglifetime: number,
}

export const defaultParticle = {
    particle: true,

    //duration: 2,
    //looping: false,
    //prewarm: false,
    startDelay: 0,

    startLifetime: -1,
    startSpeed: 1,
    startSize: 1,
    startPosition: [0, 0, 0],
    startRotation: [0, 0, 0],
    //flipRotation: false,
    startColor: [1, 1, 1],
    //gravityModifier: 0,

    rateOverTime: 1,
    //rateOverDistance: 0,

    //velocityOverLifetime
    speedModifier: 0.95,

    randomizePosition: 0,
    randomizeDirection: 0,
    randomizeSpeed: 0,
    randomizeLifetime: 0,

    //sizeOverLifetime: bezier(),
    mass: 1,
    //colorOverLifetime: (t) => ({r: Math.pow(1 - t / 3, 9) + 0.1, g: 0.1, b: 0.1}),
    //opacityOverLifetime: (t) => (1 - t / 3) * 0.4,
    //sizeFunction: (t) => smoke.initialSize + 10 * smoke.sizeFunction.evaluate(t)

    sprite: 0,

    inheritVelocity: false,

    //emitting: undefined,

    /* Created for internal usage */
    remainingLifetime: 1,
    operationalLifetime: 0,
    //velocity: new Vector3(),
    position: new Vector3(),
    accumulate: 0,
};

export const validateBurst = (burst: Burst): Burst => {

    return Object.assign({}, defaultBurst, burst)

}

export const validateParticle = (entity: Particle): Particle => {

    const e = Object.assign({}, defaultParticle, entity)

    if (entity.startColor) e.color = entity.startColor
    if (entity.startLifetime) e.remainingLifetime = entity.startLifetime

    if (entity.particle === false) { // @ts-ignore
        delete e.particle
    }

    /* Is done in the emitting system too otherwise the aprticles will share its evaluation */
    //@ts-ignore
    if (entity.colorOverLifetime) e.colorInterpolant = entity.colorOverLifetime?.createInterpolant()

    if (entity.bursts) e.bursts = entity.bursts?.map((e: Burst) => validateBurst(e))
    if (entity.emitting) e.emitting = entity.emitting?.map((e: Particle) => validateParticle(e))

    return e
}
