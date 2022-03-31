import { Vector3 } from "three"
import { validateParticle } from "./index"
import type { Particle, IGeneric } from "./index"
import {World} from "miniplex";

export const livingSystem = (entities: Particle[], world: World, delta: number) => {

    for (let i = 0; i < entities.length; i++) {

        const entity = entities[i];

        entity.remainingLifetime -= delta

        entity.operationalLifetime = entity.startLifetime - entity.remainingLifetime

        if (entity.startLifetime !== -1 && entity.remainingLifetime <= 0) world.queue.destroyEntity(entity)

    }

    world.queue.flush();

}

/* Typehint these are particles where emitting is set */
export const emittingSystem = (entities: (Particle & {emitting: Particle[]})[], world: World, delta: number) => {

    for (let i = 0; i < entities.length; i++) {

        const entity = entities[i];

        for (let j = 0; j < entity.emitting.length; j++) {

            const emitter = entity.emitting[j];

            emitter.accumulate += emitter.rateOverTime * delta

            if (emitter.bursts) {

                for (let k = 0; k < emitter.bursts.length; k++) {

                    const burst = emitter.bursts[k]

                    if (burst.cycleCount > 0 && burst.cycle >= burst.cycleCount) continue

                    if (entity.operationalLifetime >= burst.time && burst.cycle < Math.floor(entity.operationalLifetime / burst.repeatInterval)) {
                        burst.cycle++
                        emitter.accumulate += burst.count
                    }

                }

            }

            for (let k = 0; k < Math.floor(emitter.accumulate); k++) {

                const startLifetime = emitter.startLifetime + (Math.random() - .5) * emitter.randomizeLifetime

                const startRotation = emitter.inheritVelocity ? entity.velocity.clone() : new Vector3().fromArray(emitter.startRotation)

                const startSpeed = emitter.inheritVelocity ? entity.speed : emitter.startSpeed + Math.random() * emitter.randomizeSpeed - emitter.randomizeSpeed/2

                /* deep cloning objects, otherwise they won't live independent lives */

                world.queue.createEntity(validateParticle({
                    ...emitter,
                    ...(emitter.opacityOverLifetime && { opacity: { value: [1], interpolant: emitter.opacityOverLifetime.createInterpolant() } }),
                    ...(emitter.colorOverLifetime && { color: { value: [1, 1, 1], interpolant: emitter.colorOverLifetime.createInterpolant() } }),
                    ...(emitter.sizeOverLifetime && { size: { value: [1], interpolant: emitter.sizeOverLifetime.createInterpolant() } }),
                    position: new Vector3()
                        .copy(entity.position)
                        .addScaledVector(new Vector3().random(), emitter.randomizePosition),
                    velocity: startRotation
                        .addScaledVector(new Vector3().randomDirection(), emitter.randomizeRotation)
                        .setLength(startSpeed),
                    startLifetime,
                    startSpeed,
                    speed: startSpeed,
                    parent: entity.id
                }))

            }

            emitter.accumulate %= 1

        }
    }

    world.queue.flush();

};

export const movingSystem = (entities: Particle[], delta: number) => {

    for (let i = 0; i < entities.length; i++) {

        const entity = entities[i];

        if (entity.startDelay > 0) {
            entity.startDelay -= delta;
            continue;
        }

        if (entity.speedModifier) {
            entity.speed *= entity.speedModifier
        } else {
            entity.speed = entity.startSpeed
        }

        entity.velocity.setLength(entity.speed);

        entity.position.add(entity.velocity);

        entity.position.y -= entity.mass * delta;

    }

};

export const keyframeSystem = (entities: Particle[], key: keyof Particle, delta: number) => {

    for (let i = 0; i < entities.length; i++) {

        const entity = entities[i];

        const component = entity[key] as IGeneric

        if (component.interpolant) component.value = component.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

    }

};
