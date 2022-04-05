import { RegisteredEntity, World } from 'miniplex'
import * as systems from './systems'
import { Particle, validateParticle } from './validateParticle'

export class ParticleSystem {
  world: World

  constructor() {
    this.world = new World()
  }

  update = (delta: number) => {
    systems.livingSystem(this.world, delta)
    systems.emittingSystem(this.world, delta)
    systems.movingSystem(this.world, delta)

    systems.keyframeSystem(this.world, 'size', delta)
    systems.keyframeSystem(this.world, 'color', delta)
    systems.keyframeSystem(this.world, 'opacity', delta)
  }

  addParticle = (object: Particle): RegisteredEntity<any> => {
    const entity = this.world.createEntity(validateParticle(object))

    return entity
  }

  destroyParticle = (object: Particle) => {
    this.world.destroyEntity(object)
  }
}
