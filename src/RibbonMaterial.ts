import {
  AddEquation,
  Color,
  CustomBlending,
  Matrix3,
  OneFactor,
  OneMinusSrcAlphaFactor,
  ShaderChunk,
  ShaderLib,
  ShaderMaterial,
  UniformsLib,
  Vector2,
} from 'three'
import { vertex } from './ribbons.glsl'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'

var pattern = /#include <(.*)>/gm

function parseIncludes(string: string) {
  function replace(match: string, include: string) {
    var replace = ShaderChunk[include]
    return parseIncludes(replace)
  }

  return string.replace(pattern, replace)
}

//console.log(parseIncludes(vertex));
//console.log(parseIncludes(fragment));

export class RibbonMaterial extends ShaderMaterial {
  constructor() {
    super()

    this.type = 'RibbonMaterial'

    this.vertexShader = vertex

    this.fragmentShader = ShaderLib.basic.fragmentShader

    this.uniforms = mergeUniforms([
      UniformsLib.common,
      UniformsLib.specularmap,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.fog,
      {
        resolution: { value: new Vector2(1, 1) },
        sizeAttenuation: { value: 1 },
        dashArray: { value: 0 },
        dashOffset: { value: 0 },
        dashRatio: { value: 0.5 },
        useDash: { value: 0 },
        visibility: { value: 1 },
        alphaTest: { value: 0 },
        //diffuse: { value: new Color(1,0,0) },
        alphaMap: { value: null },
      },
    ])

    /*
        Blending optimized for glowing, light particles
        https://gdcvault.com/play/1017660/Technical-Artist-Bootcamp-The-VFX
        https://github.com/simondevyoutube/ThreeJS_Tutorial_BlendModes
        https://youtu.be/AxopC4yW4uY
        also the last two lines of the fragment shader were added
        possibly pass in an animatable value for emission level like simon did
        */
    /*this.blending = CustomBlending
        this.blendEquation = AddEquation
        this.blendSrc = OneFactor
        this.blendDst = OneMinusSrcAlphaFactor*/

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
          this.defines.USE_UV = 1
        },
      },
      sizeAttenuation: {
        enumerable: true,
        get() {
          //return this.material.alphaMap
        },
        set(value) {
          this.defines.USE_SIZEATTENUATION = value
        },
      },
      spriteSheetSize: {
        enumerable: true,
        get() {
          //return this.material.alphaMap
        },
        set(value) {
          this.uniforms.spriteSheetSize.value = value
          this.defines.USE_SPRITE = 1
        },
      },
      spriteSize: {
        enumerable: true,
        get() {
          //return this.material.alphaMap
        },
        set(value) {
          this.uniforms.spriteSize.value = value
          this.defines.USE_SPRITE = 1
        },
      },
    })
  }
}
