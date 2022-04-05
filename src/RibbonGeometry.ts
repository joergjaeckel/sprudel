import { BufferAttribute, BufferGeometry } from 'three'
import type { Archetype } from 'miniplex'
import { World } from 'miniplex'

export class RibbonGeometry extends BufferGeometry {
  isRibbonGeometry: boolean
  world: World
  archetype: Archetype<any>

  positions: Float32Array
  previous: Float32Array
  next: Float32Array
  sides: Float32Array
  widths: Float32Array
  uvs: Float32Array
  counters: Float32Array
  indices: Uint16Array

  _positions: number[]
  _counters: number[]

  constructor(world: World, maxCount = 10000) {
    super()

    this.isRibbonGeometry = true

    this.type = 'isRibbonGeometry'

    this.world = world

    this.archetype = world.archetype('ribbon')

    this.setAttribute('position', new BufferAttribute(new Float32Array(maxCount * 3), 3))
    this.setAttribute('previous', new BufferAttribute(new Float32Array(maxCount * 3), 3))
    this.setAttribute('next', new BufferAttribute(new Float32Array(maxCount * 3), 3))
    this.setAttribute('side', new BufferAttribute(new Float32Array(maxCount), 1))
    this.setAttribute('width', new BufferAttribute(new Float32Array(maxCount), 1))
    this.setAttribute('uv', new BufferAttribute(new Float32Array(maxCount * 2), 2))
    this.setAttribute('index', new BufferAttribute(new Float32Array(maxCount), 1))
    this.setAttribute('counters', new BufferAttribute(new Float32Array(maxCount), 1))

    this.positions = new Float32Array(maxCount * 3)
    this.previous = new Float32Array(maxCount * 3)
    this.next = new Float32Array(maxCount * 3)
    this.sides = new Float32Array(maxCount)
    this.widths = new Float32Array(maxCount)
    this.uvs = new Float32Array(maxCount * 2)
    this.counters = new Float32Array(maxCount)
    this.indices = new Uint16Array(maxCount)

    this._positions = []
    this._counters = []
  }

  copyV3 = (a: number) => {
    const aa = a * 6
    return [this._positions[aa], this._positions[aa + 1], this._positions[aa + 2]]
  }

  compareV3 = (a: number, b: number) => {
    const aa = a * 6
    const ab = b * 6
    return (
      this._positions[aa] === this._positions[ab] &&
      this._positions[aa + 1] === this._positions[ab + 1] &&
      this._positions[aa + 2] === this._positions[ab + 2]
    )
  }

  update = () => {
    this._positions = []
    this._counters = []
    const _previous = [] as number[]
    const _next = [] as number[]
    const _side = []
    const _width = []
    const _indices_array = []
    const _uvs = []
    let BPI = 0
    let BII = 0

    let _sorted = []

    for (let i = 0; i < this.archetype.entities.length; i++) {
      const e = this.archetype.entities[i]
      const array = _sorted[e.parent]
      array ? array.push(this.archetype.entities[i]) : (_sorted[e.parent] = [e])
    }

    //normalize indices
    _sorted = _sorted.filter((v) => v !== undefined && v.length > 1)

    for (let i = 0; i < _sorted.length; i++) {
      const iPoints = _sorted[i]

      for (let j = 0; j < iPoints.length; j++) {
        const p = iPoints[j].position
        var c = j / iPoints.length
        this._positions.push(p.x, p.y, p.z)
        this._positions.push(p.x, p.y, p.z)
        this._counters.push(c)
        this._counters.push(c)
      }

      const l = iPoints.length //  this._positions.current.length / 6;

      let w

      let v
      // initial previous points
      if (this.compareV3(BPI, BPI + l - 1)) {
        v = this.copyV3(BPI + l - 2)
      } else {
        v = this.copyV3(BPI)
      }

      _previous.push(v[0], v[1], v[2])
      _previous.push(v[0], v[1], v[2])

      for (let j = 0; j < l; j++) {
        // sides
        _side.push(1)
        _side.push(-1)

        // widths
        //if (this._widthCallback) w = this._widthCallback(j / (l - 1))
        //else w = 1
        _width.push(iPoints[j].linewidth)
        _width.push(iPoints[j].linewidth)

        // uvs
        _uvs.push(j / (l - 1), 0)
        _uvs.push(j / (l - 1), 1)

        if (j < l - 1) {
          // points previous to positions
          v = this.copyV3(BPI + j)
          _previous.push(v[0], v[1], v[2])
          _previous.push(v[0], v[1], v[2])

          // indices
          const n = BPI * 2 + j * 2

          _indices_array.push(n + 0, n + 1, n + 2)
          _indices_array.push(n + 2, n + 1, n + 3)
        }
        if (j > 0) {
          // points after positions
          v = this.copyV3(BPI + j)
          _next.push(v[0], v[1], v[2])
          _next.push(v[0], v[1], v[2])
        }
      }

      // last next point
      if (this.compareV3(BPI + l - 1, BPI)) {
        // if last is first one
        v = this.copyV3(BPI + 1)
      } else {
        v = this.copyV3(BPI + l - 1)
      }

      _next.push(v[0], v[1], v[2])
      _next.push(v[0], v[1], v[2])

      BPI += iPoints.length
      BII += (iPoints.length - 1) * 2 * 3
    }

    ;(this.attributes.position as BufferAttribute).copyArray(this._positions)
    this.attributes.position.needsUpdate = true
    ;(this.attributes.counters as BufferAttribute).copyArray(this._counters)
    this.attributes.counters.needsUpdate = true
    ;(this.attributes.previous as BufferAttribute).copyArray(_previous)
    this.attributes.previous.needsUpdate = true
    ;(this.attributes.next as BufferAttribute).copyArray(_next)
    this.attributes.next.needsUpdate = true
    ;(this.attributes.side as BufferAttribute).copyArray(_side)
    this.attributes.side.needsUpdate = true
    ;(this.attributes.width as BufferAttribute).copyArray(_width)
    this.attributes.width.needsUpdate = true
    ;(this.attributes.index as BufferAttribute).copyArray([0, 2, 1, 0, 3, 2])
    this.attributes.index.needsUpdate = true
    ;(this.attributes.uv as BufferAttribute).copyArray(_uvs)
    this.attributes.uv.needsUpdate = true

    this.setDrawRange(0, BPI * 3 * 2)
    //this.geometry.setIndex(new BufferAttribute(new Uint16Array([0, 1, 2, 2, 1, 3]), 1));
    this.setIndex(new BufferAttribute(new Uint16Array(_indices_array), 1))

    this.computeBoundingSphere()
    this.computeBoundingBox()
  }
}
