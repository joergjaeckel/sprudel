import {
    Color,
    Matrix3,
    BufferGeometry,
    Points,
    ShaderMaterial,
    Texture,
    BufferAttribute,
    ShaderChunk,
    TextureLoader
} from 'three'
import {particleEntities} from './index'
import {vertex, fragment} from './points.glsl'
// @ts-ignore
import getImageData from './assets/images/circle_05.png'

var pattern = /#include <(.*)>/gm;

function parseIncludes(string: string) {
    function replace(match: string, include: string) {
        var replace = ShaderChunk[include];
        return parseIncludes(replace);
    }

    return string.replace(pattern, replace);
}

//console.log(parseIncludes(vertex));
//console.log(parseIncludes(fragment));

type ParticleBufferGeometryProps = {
    maxCount: number
}

export class ParticleBufferGeometry extends BufferGeometry {
    isParticleRenderer: boolean

    constructor({maxCount}: ParticleBufferGeometryProps) {

        super()

        this.isParticleRenderer = true
        this.type = 'ParticleRenderer'

        this.setAttribute('position', new BufferAttribute(new Float32Array(maxCount * 3), 3));
        this.setAttribute('color', new BufferAttribute(new Float32Array(maxCount * 3), 3));
        this.setAttribute('opacity', new BufferAttribute(new Float32Array(maxCount), 1));
        this.setAttribute('size', new BufferAttribute(new Float32Array(maxCount), 1));
        this.setAttribute('sprite', new BufferAttribute(new Float32Array(maxCount), 1));

        this.update()

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

type ParticleMaterialProps = {
    alphaMap?: Texture
}

export class ParticleMaterial extends ShaderMaterial {

    constructor({alphaMap}: ParticleMaterialProps) {

        super()

        var loader = new TextureLoader();
        var texture = loader.load( getImageData );

        this.vertexShader = vertex
        this.fragmentShader = fragment
        this.uniforms = {
            diffuse: {value: new Color(0xffffff)},
            opacity: {value: 1.0},
            scale: {value: 500.0},
            map: {value: null},
            alphaMap: {value: texture},
            alphaTest: {value: 0},
            uvTransform: {value: new Matrix3()},
            fogDensity: {value: 0.00025},
            fogNear: {value: 1},
            fogFar: {value: 2000},
            fogColor: {value: new Color(0xffffff)},
            sizeAttenuation: {value: true},
            spriteSheetSize: {value: {x: 1024, y: 1024}},
            spriteSize: {value: {x: 1024, y: 1024}}
        }
        this.defines = {
            'USE_ALPHAMAP': 1,
            //'USE_MAP': 1,
            //'USE_UV': 1,
            'USE_SIZEATTENUATION': 1,
        }
        this.vertexColors = true
        this.transparent = true
        this.depthWrite = false

    }
}

type ParticleRendererProps = {
    maxCount: number
    alphaMap: Texture
}

export class ParticleRenderer extends Points {

    constructor() {

        super()

        this.geometry = new ParticleBufferGeometry({maxCount: 21})

        this.material = new ParticleMaterial({alphaMap: new Texture()})

        Object.defineProperties(this, {
            // for declaritive architectures
            // to return the same value that sets the points
            // eg. this.points = points
            // console.log(this.points) -> points
            maxCount: {
                enumerable: true,
                get() {
                    return console.log('get maxCount')
                },
                set(value) {
                    console.log('set maxCount', value)
                }
            },
        })

    }
}
