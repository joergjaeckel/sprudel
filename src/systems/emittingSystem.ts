import type { World } from 'miniplex'
import { Interpolant, KeyframeTrack, Vector3 } from 'three'
import { validateParticle } from '../validateParticle'

export const emittingSystem = (world: World, delta: number) => {
  const { entities } = world.archetype('emitting')

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    for (let j = 0; j < entity.emitting.length; j++) {
      const emitter = entity.emitting[j]

      emitter.accumulate += emitter.rateOverTime * delta

      if (emitter.bursts) {
        for (let k = 0; k < emitter.bursts.length; k++) {
          const burst = emitter.bursts[k]

          if (burst.cycleCount > 0 && burst.cycle >= burst.cycleCount) continue

          if (
            entity.operationalLifetime >= burst.time &&
            burst.cycle < Math.floor(entity.operationalLifetime / burst.repeatInterval + burst.repeatInterval)
          ) {
            burst.cycle++
            emitter.accumulate += burst.count
          }
        }
      }

      for (let k = 0; k < Math.floor(emitter.accumulate); k++) {
        const startLifetime = emitter.startLifetime + (Math.random() - 0.5) * emitter.randomizeLifetime

        const startRotation = emitter.inheritVelocity
          ? entity.velocity.clone()
          : new Vector3().fromArray(emitter.startRotation)

        const startSpeed = emitter.inheritVelocity
          ? entity.speed
          : emitter.startSpeed + Math.random() * emitter.randomizeSpeed - emitter.randomizeSpeed / 2

        /* deep cloning objects, otherwise they won't live independent lives */

        world.queue.createEntity(
          validateParticle({
            ...emitter,
            ...(emitter.opacityOverLifetime && {
              opacity: {
                value: [1],
                interpolant: (
                  emitter.opacityOverLifetime as KeyframeTrack & { createInterpolant: () => Interpolant }
                ).createInterpolant(),
              },
            }),
            ...(emitter.colorOverLifetime && {
              color: {
                value: [1, 1, 1],
                interpolant: (
                  emitter.colorOverLifetime as KeyframeTrack & { createInterpolant: () => Interpolant }
                ).createInterpolant(),
              },
            }),
            ...(emitter.sizeOverLifetime && {
              size: {
                value: [1],
                interpolant: (
                  emitter.sizeOverLifetime as KeyframeTrack & { createInterpolant: () => Interpolant }
                ).createInterpolant(),
              },
            }),
            position: new Vector3()
              .copy(entity.position)
              .addScaledVector(new Vector3().random(), emitter.randomizePosition),
            velocity: startRotation
              .addScaledVector(new Vector3().randomDirection(), emitter.randomizeRotation)
              .setLength(startSpeed),
            startLifetime,
            startSpeed,
            speed: startSpeed,
            parent: entity.id,
          }),
        )
      }

      emitter.accumulate %= 1
    }
  }

  world.queue.flush()
}
