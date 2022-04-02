import { IGeneric, Particle } from '../index'

export const keyframeSystem = (entities: Particle[], key: keyof Particle, delta: number) => {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    const component = entity[key] as IGeneric

    if (component.interpolant)
      component.value = component.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)
  }
}
