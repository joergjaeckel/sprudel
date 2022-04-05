import type { World } from 'miniplex'

export const livingSystem = (world: World, delta: number) => {
  const { entities } = world.archetype('startLifetime')

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    entity.remainingLifetime -= delta

    entity.operationalLifetime += delta

    if (entity.startLifetime !== -1 && entity.remainingLifetime <= 0) world.queue.destroyEntity(entity)
  }

  world.queue.flush()
}
