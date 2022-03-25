import { useFrame } from "@react-three/fiber";
import {
    Vector2,
    ShaderChunk,
    UniformsLib,
    Vector3,
    BufferAttribute,
    BufferGeometry,
    Texture,
    Color,
    ShaderLib, AdditiveBlending
} from "three";
import { mergeUniforms } from "three/src/renderers/shaders/UniformsUtils.js";
import { useEffect, useMemo, useRef } from "react";
import { ribbonEntities } from "./index";
import { vertex } from "./ribbons.glsl";

var pattern = /#include <(.*)>/gm;

function parseIncludes(string: string) {
    function replace(match: string, include: string) {
        var replace = ShaderChunk[include];
        return parseIncludes(replace);
    }
    return string.replace(pattern, replace);
}

//console.log(parseIncludes(vertex));
//console.log(parseIncludes(ShaderLib.basic.fragmentShader));

const testPoints = {
    entities: [
        { parent: 0, position: new Vector3(1, 1, 1) },
        { parent: 0, position: new Vector3(1, 2, 1) },

        { parent: 1, position: new Vector3(2, 2, 2) },
        { parent: 1, position: new Vector3(3, 3, 3) },
        { parent: 1, position: new Vector3(4, 4, 4) },

        { parent: 2, position: new Vector3(-2, -2, -2) },
        { parent: 2, position: new Vector3(-3, -3, -3) },
        { parent: 2, position: new Vector3(-4, -4, -4) },
        { parent: 2, position: new Vector3(-5, -5, -5) }
    ]
};

export const RibbonRenderer = ({ alphaMap, wireframe, maxCount = 10000 }: {alphaMap: Texture, wireframe: boolean, maxCount: number}) => {
    const ref = useRef<BufferGeometry>();

    const positions = useMemo(() => new Float32Array(maxCount * 3), []);
    const previous = useMemo(() => new Float32Array(maxCount * 3), []);
    const next = useMemo(() => new Float32Array(maxCount * 3), []);
    const sides = useMemo(() => new Float32Array(maxCount * 1), []);
    const widths = useMemo(() => new Float32Array(maxCount * 1), []);
    const uvs = useMemo(() => new Float32Array(maxCount * 2), []);
    const indices = useMemo(() => new Uint16Array(maxCount * 1), []);
    const counters = useMemo(() => new Float32Array(maxCount * 1), []);

    const _positions = useRef<number[]>([]);
    const _counters = useRef<number[]>([]);

    const compareV3 = (a: number, b: number) => {
        const aa = a * 6;
        const ab = b * 6;
        return (
            _positions.current[aa] === _positions.current[ab] &&
            _positions.current[aa + 1] === _positions.current[ab + 1] &&
            _positions.current[aa + 2] === _positions.current[ab + 2]
        );
    };

    const copyV3 = (a: number) => {
        const aa = a * 6;
        return [_positions.current[aa], _positions.current[aa + 1], _positions.current[aa + 2]];
    };

    useFrame(() => {
        if(!ref.current) return
        _positions.current = []
        _counters.current = []
        const _previous = [] as number[]
        const _next = [] as number[]
        const _side = []
        const _width = []
        const _indices_array = []
        const _uvs = []
        let BPI = 0
        let BII = 0

        let _sorted = [];

        for (let i = 0; i < ribbonEntities.entities.length; i++) {
            const e = ribbonEntities.entities[i];
            const array = _sorted[e.parent];
            array ? array.push(ribbonEntities.entities[i]) : (_sorted[e.parent] = [e]);
        }

        //normalize indices
        _sorted = _sorted.filter((v) => v !== undefined && v.length > 1);

        for (let i = 0; i < _sorted.length; i++) {
            const iPoints = _sorted[i];

            for (let j = 0; j < iPoints.length; j++) {
                const p = iPoints[j].position;
                var c = j / iPoints.length;
                _positions.current.push(p.x, p.y, p.z);
                _positions.current.push(p.x, p.y, p.z);
                _counters.current.push(c);
                _counters.current.push(c);
            }

            const l = iPoints.length; //  _positions.current.length / 6;

            let w;

            let v;
            // initial previous points
            if (compareV3(BPI, BPI + l - 1)) {
                v = copyV3(BPI + l - 2);
            } else {
                v = copyV3(BPI);
            }

            _previous.push(v[0], v[1], v[2]);
            _previous.push(v[0], v[1], v[2]);

            for (let j = 0; j < l; j++) {
                // sides
                _side.push(1);
                _side.push(-1);

                // widths
                //if (this._widthCallback) w = this._widthCallback(j / (l - 1))
                //else w = 1
                _width.push(iPoints[j].linewidth);
                _width.push(iPoints[j].linewidth);

                // uvs
                _uvs.push(j / (l - 1), 0);
                _uvs.push(j / (l - 1), 1);

                if (j < l - 1) {
                    // points previous to positions
                    v = copyV3(BPI + j);
                    _previous.push(v[0], v[1], v[2]);
                    _previous.push(v[0], v[1], v[2]);

                    // indices
                    const n = BPI * 2 + j * 2;

                    _indices_array.push(n + 0, n + 1, n + 2);
                    _indices_array.push(n + 2, n + 1, n + 3);
                }
                if (j > 0) {
                    // points after positions
                    v = copyV3(BPI + j);
                    _next.push(v[0], v[1], v[2]);
                    _next.push(v[0], v[1], v[2]);
                }
            }

            // last next point
            if (compareV3(BPI + l - 1, BPI)) {
                // if last is first one
                v = copyV3(BPI + 1);
            } else {
                v = copyV3(BPI + l - 1);
            }

            _next.push(v[0], v[1], v[2]);
            _next.push(v[0], v[1], v[2]);

            BPI += iPoints.length;
            BII += (iPoints.length - 1) * 2 * 3;
        }

        (ref.current.attributes.position as BufferAttribute).copyArray(_positions.current)
        ref.current.attributes.position.needsUpdate = true;
        (ref.current.attributes.counters as BufferAttribute).copyArray(_counters.current);
        ref.current.attributes.counters.needsUpdate = true;
        (ref.current.attributes.previous as BufferAttribute).copyArray(_previous);
        ref.current.attributes.previous.needsUpdate = true;
        (ref.current.attributes.next as BufferAttribute).copyArray(_next);
        ref.current.attributes.next.needsUpdate = true;
        (ref.current.attributes.side as BufferAttribute).copyArray(_side);
        ref.current.attributes.side.needsUpdate = true;
        (ref.current.attributes.width as BufferAttribute).copyArray(_width);
        ref.current.attributes.width.needsUpdate = true;
        (ref.current.attributes.index as BufferAttribute).copyArray([0, 2, 1, 0, 3, 2]);
        ref.current.attributes.index.needsUpdate = true;
        (ref.current.attributes.uv as BufferAttribute).copyArray(_uvs);
        ref.current.attributes.uv.needsUpdate = true;

        ref.current.setDrawRange(0, BPI * 3 * 2);
        //ref.current.geometry.setIndex(new BufferAttribute(new Uint16Array([0, 1, 2, 2, 1, 3]), 1));
        ref.current.setIndex(new BufferAttribute(new Uint16Array(_indices_array), 1));

        ref.current.computeBoundingSphere();
        ref.current.computeBoundingBox();
    });

    return (
        <mesh>
            <bufferGeometry ref={ref}>
                <bufferAttribute attachObject={["attributes", "position"]} count={maxCount} array={positions} itemSize={3} />
                <bufferAttribute attachObject={["attributes", "previous"]} count={maxCount} array={previous} itemSize={3} />
                <bufferAttribute attachObject={["attributes", "next"]} count={maxCount} array={next} itemSize={3} />
                <bufferAttribute attachObject={["attributes", "side"]} count={maxCount} array={sides} itemSize={1} />
                <bufferAttribute attachObject={["attributes", "width"]} count={maxCount} array={widths} itemSize={1} />
                <bufferAttribute attachObject={["attributes", "uv"]} count={maxCount} array={uvs} itemSize={2} />
                <bufferAttribute attachObject={["attributes", "index"]} count={maxCount} array={indices} itemSize={1} />
                <bufferAttribute attachObject={["attributes", "counters"]} count={maxCount} array={counters} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertex}
                fragmentShader={ShaderLib.basic.fragmentShader}
                defines={{
                    'USE_ALPHAMAP': 1,
                    'USE_UV': 1,
            }}
                uniforms={mergeUniforms([
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
                        alphaMap: { value: alphaMap }
                    }
                ])}
                wireframe={wireframe}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
};
