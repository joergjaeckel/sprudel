import { BufferAttribute, BufferGeometry } from 'three'
import type { Archetype, World } from 'miniplex'

export class ParticleGeometry extends BufferGeometry {
  isParticleGeometry: boolean

  world: World

  archetype: Archetype<any>

  constructor(world: World, maxCount = 10000) {
    super()

    this.isParticleGeometry = true

    this.type = 'isParticleGeometry'

    this.world = world

    this.archetype = world.archetype('particle')

    this.setAttribute('position', new BufferAttribute(new Float32Array(maxCount * 3), 3))
    this.setAttribute('color', new BufferAttribute(new Float32Array(maxCount * 3), 3))
    this.setAttribute('opacity', new BufferAttribute(new Float32Array(maxCount), 1))
    this.setAttribute('size', new BufferAttribute(new Float32Array(maxCount), 1))
    this.setAttribute('sprite', new BufferAttribute(new Float32Array(maxCount), 1))

    this.update()
  }

  update() {
    for (let i = 0; i < this.archetype.entities.length; i++) {
      const {
        position = { x: 0, y: 0, z: 0 },
        opacity = { value: [1] },
        size = { value: [1] },
        color = { value: [1, 1, 1] },
        sprite = 0,
      } = this.archetype.entities[i]

      this.attributes.position.setXYZ(i, position.x, position.y, position.z)
      this.attributes.color.setXYZ(i, color.value[0], color.value[1], color.value[2])
      this.attributes.opacity.setX(i, opacity.value[0])
      this.attributes.size.setX(i, size.value[0])
      this.attributes.sprite.setX(i, sprite)
    }

    this.setDrawRange(0, this.archetype.entities.length)

    this.attributes.position.needsUpdate = true
    this.attributes.color.needsUpdate = true
    this.attributes.opacity.needsUpdate = true
    this.attributes.size.needsUpdate = true
    this.attributes.sprite.needsUpdate = true
  }
}
