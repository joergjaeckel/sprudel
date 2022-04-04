import { IGeneric, RuntimeParticle } from '../index'

export const keyframeSystem = (entities: RuntimeParticle[], key: keyof RuntimeParticle, delta: number) => {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    const component = entity[key] as IGeneric

    if (component.interpolant)
      component.value = component.interpolant.evaluate(entity.operationalLifetime / entity.startLifetime)
  }
}
