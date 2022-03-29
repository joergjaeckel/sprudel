import { Vector3 } from "three"
import {
    movingEntities,
    livingEntities,
    emittingEntities,
    world,
    particleEntities,
    scalingEntities,
    coloringEntities, validateParticle, fadingEntities
} from "./index"

export const movingSystem = (delta: number) => {

    for (let i = 0; i < movingEntities.entities.length; i++) {

        const entity = movingEntities.entities[i];

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

export const livingSystem = (delta: number) => {

    for (let i = 0; i < livingEntities.entities.length; i++) {

        const entity = livingEntities.entities[i];

        entity.remainingLifetime -= delta

        entity.operationalLifetime = entity.startLifetime - entity.remainingLifetime

        if (entity.startLifetime !== -1 && entity.remainingLifetime <= 0) {
            world.queue.destroyEntity(entity)
            continue
        }

    }

    world.queue.flush();

}

export const emittingSystem = (delta: number) => {

    for (let i = 0; i < emittingEntities.entities.length; i++) {

        const entity = emittingEntities.entities[i];

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
                    ...(emitter.opacityOverLifetime && { opacity: { interpolant: emitter.opacityOverLifetime.createInterpolant() } }),
                    ...(emitter.colorOverLifetime && { color: { interpolant: emitter.colorOverLifetime.createInterpolant() } }),
                    ...(emitter.sizeOverLifetime && { size: { interpolant: emitter.sizeOverLifetime.createInterpolant() } }),
                    position: new Vector3()
                        .copy(entity.position)
                        .addScaledVector(new Vector3().random(), emitter.randomizePosition),
                    velocity: startRotation
                        .addScaledVector(new Vector3().randomDirection(), emitter.randomizeDirection)
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

export const coloringSystem = (delta: number) => {

    for (let i = 0; i < coloringEntities.entities.length; i++) {

        const entity = coloringEntities.entities[i];

        if (entity.color.interpolant) entity.color.value = entity.color.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

    }

};

export const fadingSystem = (delta: number) => {

    for (let i = 0; i < fadingEntities.entities.length; i++) {

        const entity = fadingEntities.entities[i];

        if (entity.opacity.interpolant) entity.opacity.value = entity.opacity.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

    }

};

export const scalingSystem = (delta: number) => {

    for (let i = 0; i < scalingEntities.entities.length; i++) {

        const entity = scalingEntities.entities[i];

        if (entity.size.interpolant) entity.size.value = entity.size.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

    }

};
