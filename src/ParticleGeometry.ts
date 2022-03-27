import {BufferAttribute, BufferGeometry} from "three";
import {particleEntities} from "./index";

type ParticleBufferGeometryProps = {
    maxCount: number
}

export class ParticleGeometry extends BufferGeometry {

    isParticleRenderer: boolean
    _maxCount: number

    constructor(parameters: any) {

        super()

        this._maxCount = 10

        this.isParticleRenderer = true
        this.type = 'ParticleRenderer'

        this.setAttribute('position', new BufferAttribute(new Float32Array(this._maxCount * 3), 3));
        this.setAttribute('color', new BufferAttribute(new Float32Array(this._maxCount * 3), 3));
        this.setAttribute('opacity', new BufferAttribute(new Float32Array(this._maxCount), 1));
        this.setAttribute('size', new BufferAttribute(new Float32Array(this._maxCount), 1));
        this.setAttribute('sprite', new BufferAttribute(new Float32Array(this._maxCount), 1));

        this.update()

        Object.defineProperties(this, {
            maxCount: {
                enumerable: true,
                get() {
                    //return this.material.alphaMap
                },
                set(value) {
                    this.setAttribute('position', new BufferAttribute(new Float32Array(value * 3), 3));
                    this.setAttribute('color', new BufferAttribute(new Float32Array(value * 3), 3));
                    this.setAttribute('opacity', new BufferAttribute(new Float32Array(value), 1));
                    this.setAttribute('size', new BufferAttribute(new Float32Array(value), 1));
                    this.setAttribute('sprite', new BufferAttribute(new Float32Array(value), 1));
                }
            },
        })

    }

    update() {

        for (let i = 0; i < particleEntities.entities.length; i++) {

            const {
                position = {x: 0, y: 0, z: 0},
                opacity = 1,
                startSize = 1,
                color = [1, 1, 1],
                sprite = 0,
            } = particleEntities.entities[i]

            this.attributes.position.setXYZ(i, position.x, position.y, position.z)
            this.attributes.color.setXYZ(i, color[0], color[1], color[2])
            this.attributes.opacity.setX(i, opacity)
            this.attributes.size.setX(i, startSize)
            this.attributes.sprite.setX(i, sprite)

        }

        this.setDrawRange(0, particleEntities.entities.length);

        this.attributes.position.needsUpdate = true
        this.attributes.color.needsUpdate = true
        this.attributes.opacity.needsUpdate = true
        this.attributes.size.needsUpdate = true
        this.attributes.sprite.needsUpdate = true

    }

}
