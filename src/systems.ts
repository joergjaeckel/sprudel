import { Vector3 } from "three"
import {movingEntities, livingEntities, emittingEntities, world, particleEntities} from "./index"

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

        if (entity.sizeFunction) entity.size = entity.sizeFunction(entity.lifetime / entity.maxAge);

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

        if (entity.colorInterpolant) entity.color = entity.colorInterpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

        if (entity.opacityInterpolant) entity.opacity = entity.opacityInterpolant.evaluate(entity.operationalLifetime / entity.startLifetime)

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
                world.queue.createEntity({
                    ...emitter,
                    // @ts-ignore
                    ...(emitter.emitting && {emitting: emitter.emitting.map(({speedModifier, opacityOverLifetime, ...rest}: {speedModifier: () => void, rest: any}) => ({...structuredClone(rest), speedModifier, opacityOverLifetime}))}),
                    ...(emitter.colorOverLifetime && {colorInterpolant: emitter.colorOverLifetime.createInterpolant()}),
                    ...(emitter.opacityOverLifetime && {opacityInterpolant: emitter.opacityOverLifetime.createInterpolant()}),
                    startLifetime,
                    remainingLifetime: startLifetime,
                    startRotation: startRotation.toArray(),
                    position: new Vector3()
                        .copy(entity.position)
                        .addScaledVector(new Vector3().random(), emitter.randomizePosition),
                    velocity: startRotation
                        .addScaledVector(new Vector3().randomDirection(), emitter.randomizeDirection)
                        .setLength(startSpeed),
                    startSpeed,
                    speed: startSpeed,
                    parent: entity.id
                });

            }

            emitter.accumulate %= 1

        }
    }

    world.queue.flush();

};