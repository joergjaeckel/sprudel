import {
    AddEquation,
    Color,
    CustomBlending,
    Matrix3,
    OneFactor,
    OneMinusSrcAlphaFactor,
    ShaderChunk,
    ShaderMaterial
} from "three";
import {fragment, vertex} from "./points.glsl";

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

export class ParticleMaterial extends ShaderMaterial {

    constructor() {

        super()

        this.type = 'ParticleMaterial'

        this.vertexShader = vertex

        this.fragmentShader = fragment

        this.uniforms = {
            diffuse: {value: new Color(0xffffff)},
            opacity: {value: 1.0},
            scale: {value: 500.0},
            map: {value: null},
            alphaMap: {value: null},
            alphaTest: {value: 0},
            uvTransform: {value: new Matrix3()},
            fogDensity: {value: 0.00025},
            fogNear: {value: 1},
            fogFar: {value: 2000},
            fogColor: {value: new Color(0xffffff)},
            spriteSheetSize: {value: {x: 1024, y: 1024}},
            spriteSize: {value: {x: 1024, y: 1024}}
        }

        this.defines = {
            USE_SIZEATTENUATION: 1,
        }

        /*
        Blending optimized for glowing, light particles
        https://gdcvault.com/play/1017660/Technical-Artist-Bootcamp-The-VFX
        https://github.com/simondevyoutube/ThreeJS_Tutorial_BlendModes
        https://youtu.be/AxopC4yW4uY
        also the last two lines of the fragment shader were added
        possibly pass in an animatable value for emission level like simon did
        */
        this.blending = CustomBlending
        this.blendEquation = AddEquation
        this.blendSrc = OneFactor
        this.blendDst = OneMinusSrcAlphaFactor

        this.depthTest = true
        this.depthWrite = false

        this.vertexColors = true

        this.transparent = true

        Object.defineProperties(this, {
            alphaMap: {
                enumerable: true,
                get() {
                    //return this.material.alphaMap
                },
                set(value) {
                    this.uniforms.alphaMap.value = value
                    this.defines.USE_ALPHAMAP = 1
                }
            },
            sizeAttenuation: {
                enumerable: true,
                get() {
                    //return this.material.alphaMap
                },
                set(value) {
                    this.defines.USE_SIZEATTENUATION = value
                }
            },
            spriteSheetSize: {
                enumerable: true,
                get() {
                    //return this.material.alphaMap
                },
                set(value) {
                    this.uniforms.spriteSheetSize.value = value
                    this.defines.USE_SPRITE = 1
                }
            },
            spriteSize: {
                enumerable: true,
                get() {
                    //return this.material.alphaMap
                },
                set(value) {
                    this.uniforms.spriteSize.value = value
                    this.defines.USE_SPRITE = 1
                }
            },
        })

    }
}
