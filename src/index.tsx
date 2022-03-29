import {IEntity, World} from 'miniplex'
import {ColorKeyframeTrack, Interpolant, KeyframeTrack, NumberKeyframeTrack, Vector3} from "three";

export const world = new World()

export const movingEntities = world.archetype("speed");
export const livingEntities = world.archetype("startLifetime");
export const scalingEntities = world.archetype('sizeOverLifetime');
export const coloringEntities = world.archetype('colorOverLifetime');
export const fadingEntities = world.archetype('opacityOverLifetime');

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

interface IGeneric {
    value: number[]
    interpolant?: Interpolant
    keyframes?: KeyframeTrack
    customFn?: (delta: number) => void
}

export type Particle = {

    particle?: boolean
    hideParticle?: boolean

    color?: IGeneric
    colorOverLifetime?: ColorKeyframeTrack | ((delta: number) => void)

    size?: IGeneric
    sizeOverLifetime?: NumberKeyframeTrack | ((delta: number) => void)

    opacity?: IGeneric
    opacityOverLifetime?: NumberKeyframeTrack | ((delta: number) => void)

    //duration: 2,
    //looping: false,
    //prewarm: false,
    startDelay: number

    startLifetime: number
    startSpeed: number
    startPosition: [number, number, number]
    startRotation: [number, number, number]
    //flipRotation: false,
    //gravityModifier: 0,

    rateOverTime: number
    //rateOverDistance: 0,

    //velocityOverLifetime

    randomizePosition: number
    randomizeDirection: number
    randomizeSpeed: number
    randomizeLifetime: number

    mass: number

    sprite: number

    inheritVelocity: boolean

    emitting?: Particle[]
    bursts?: Burst[]

    remainingLifetime: number,
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
    startSize: 1,
    startPosition: [0, 0, 0],
    startRotation: [0, 0, 0],
    //flipRotation: false,
    //gravityModifier: 0,

    rateOverTime: 1,
    //rateOverDistance: 0,

    //velocityOverLifetime
    speedModifier: 0.95,

    randomizePosition: 0,
    randomizeDirection: 0,
    randomizeSpeed: 0,
    randomizeLifetime: 0,

    mass: 1,

    sprite: 0,

    inheritVelocity: false,

    /* Created for internal usage */
    remainingLifetime: 1,
    operationalLifetime: 0,
    position: new Vector3(),
    accumulate: 0,
};

export const validateBurst = (burst: Burst): Burst => {

    return Object.assign({}, defaultBurst, burst)

}

const evalKeys = ['size', 'color', 'opacity']

export const validateParticle = (entity: Particle): Particle => {

    const e = Object.assign({}, defaultParticle, entity) as Particle

    evalKeys.map(key => {

        const component = entity[`${key}OverLifetime` as keyof Particle]

        /* parse static color from array */
        // @ts-ignore non-changing color
        if (Array.isArray(entity[key])) e[key] = { value: entity[key] }

        /* parse static opacity or size from number */
        // @ts-ignore
        if (typeof entity[key] === 'number') e[key] = { value:[ entity[key] ] }

        /* parse dynamic ...OverLifetime props from KeyframeTrack */
        if (component && component instanceof KeyframeTrack) {

            //@ts-ignore
            e[key].interpolant = component.createInterpolant()

            // @ts-ignore
            e[key].keyframes = component

            // @ts-ignore
            e[key].value = e[key].interpolant.evaluate(0)

        }

    })

    if (entity.startLifetime) e.remainingLifetime = entity.startLifetime

    if (entity.bursts) e.bursts = entity.bursts?.map((burst: Burst) => validateBurst(burst))

    if (entity.emitting) e.emitting = entity.emitting?.map((emitter: Particle) => validateParticle(emitter))

    if (e.hideParticle) delete e.particle

    return e
}
