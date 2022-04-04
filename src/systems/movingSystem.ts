import { RuntimeParticle } from '../index'

export const movingSystem = (entities: RuntimeParticle[], delta: number) => {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    if (entity.startDelay > 0) {
      entity.startDelay -= delta
      continue
    }

    if (entity.speedModifier) {
      entity.speed *= entity.speedModifier
    } else {
      entity.speed = entity.startSpeed
    }

    entity.velocity.setLength(entity.speed)

    entity.position.add(entity.velocity)

    entity.position.y -= entity.mass * delta
  }
}
