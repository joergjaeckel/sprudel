import {useFrame} from "@react-three/fiber";
import {Color, Matrix3, BufferGeometry, Texture} from "three";
import {useMemo, useRef} from "react";
import {particleEntities} from "./index";
import {vertex, fragment} from "./points.glsl";

type ParticleRendererProps = {
    wireframe: boolean
    alphaMap: Texture
    maxCount: number
}

export const ParticleRenderer = ({ wireframe, alphaMap, maxCount = 10000 }: ParticleRendererProps) => {

    const ref = useRef<BufferGeometry>();

    const positions = useMemo(() => new Float32Array(maxCount * 3), []);
    const colors = useMemo(() => new Float32Array(maxCount * 3), []);
    const opacities = useMemo(() => new Float32Array(maxCount), []);
    const sizes = useMemo(() => new Float32Array(maxCount), []);
    const sprites = useMemo(() => new Float32Array(maxCount), []);

    alphaMap.flipY = true

    useFrame(() => {

        if (!ref.current) return

        for (let i = 0; i < particleEntities.entities.length; i++) {
            const {
                position = {x: 0, y: 0, z: 0},
                opacity = 1,
                startSize = 1,
                color = [1, 1, 1],
                sprite = 0,
            } = particleEntities.entities[i];
            //console.log(color);
            ref.current.attributes.position.setXYZ(i, position.x, position.y, position.z)
            ref.current.attributes.color.setXYZ(i, color[0], color[1], color[2])
            ref.current.attributes.opacity.setX(i, opacity)
            ref.current.attributes.size.setX(i, startSize)
            ref.current.attributes.sprite.setX(i, sprite)
        }

        ref.current.setDrawRange(0, particleEntities.entities.length);

        ref.current.attributes.position.needsUpdate = true;
        ref.current.attributes.color.needsUpdate = true;
        ref.current.attributes.opacity.needsUpdate = true;
        ref.current.attributes.size.needsUpdate = true;
        ref.current.attributes.sprite.needsUpdate = true;

    });

    return (
        <points>
            <bufferGeometry ref={ref}>
                <bufferAttribute attachObject={["attributes", "position"]} count={maxCount} array={positions} itemSize={3}/>
                <bufferAttribute attachObject={["attributes", "color"]} count={maxCount} array={colors} itemSize={3}/>
                <bufferAttribute attachObject={["attributes", "opacity"]} count={maxCount} array={opacities} itemSize={1}/>
                <bufferAttribute attachObject={["attributes", "size"]} count={maxCount} array={sizes} itemSize={1}/>
                <bufferAttribute attachObject={["attributes", "sprite"]} count={maxCount} array={sprites} itemSize={1}/>
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={{
                    diffuse: {value: new Color(0xffffff)},
                    opacity: {value: 1.0},
                    scale: {value: 500.0},
                    map: {value: null},
                    alphaMap: {value: alphaMap},
                    alphaTest: {value: 0},
                    uvTransform: {value: new Matrix3()},
                    fogDensity: {value: 0.00025},
                    fogNear: {value: 1},
                    fogFar: {value: 2000},
                    fogColor: {value: new Color(0xffffff)},
                    sizeAttenuation: {value: true},
                    spriteSheetSize: {value: {x: 1024, y: 1024}},
                    spriteSize: {value: {x: 128, y: 128}}
                }}
                vertexColors={true}
                //@ts-ignore
                sizeAttenuation={true}
                //@ts-ignore
                alphaMap={alphaMap}
                transparent={true}
                depthWrite={false}
                wireframe={wireframe}
            />
        </points>
    );
};
