import type { World } from 'miniplex'
import { IGeneric, RuntimeParticle } from '../validateParticle'

export const keyframeSystem = (world: World, key: keyof RuntimeParticle, delta: number) => {
  const { entities } = world.archetype(`${key}OverLifetime`)

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    const component = entity[key] as IGeneric

    if (component.interpolant)
      component.value = component.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)
  }
}
