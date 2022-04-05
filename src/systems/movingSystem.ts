import type { World } from 'miniplex'
import {Vector3} from "three";

const gravityForce = new Vector3(0,-10,0)

export const movingSystem = (world: World, delta: number) => {
  const { entities } = world.archetype('speed')

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

    entity.velocity.setLength(entity.speed).add(gravityForce.setLength(delta))

    //entity.velocity.y -= entity.mass * delta

    entity.position.add(entity.velocity)

  }
}
