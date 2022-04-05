import { RegisteredEntity, World } from 'miniplex'
import * as systems from './systems'
import { Particle, validateParticle } from './validateParticle'
import {Scene} from "three";

export class ParticleSystem {
  world: World
  scene: Scene

  constructor(scene: Scene) {
    this.world = new World()
    this.scene = scene
  }

  update = (delta: number) => {
    systems.livingSystem(this.world, delta)
    systems.emittingSystem(this.world, delta)
    systems.collidingSystem(this.world, this.scene, delta)
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
