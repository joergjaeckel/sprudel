import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    ParticleSystem,
    ParticleGeometry,
    ParticleMaterial,
    RibbonGeometry,
    RibbonMaterial,
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import trailSheet from './assets/images/trailsheet.png'
import {TextureLoader, Vector3} from "three";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial, RibbonGeometry, RibbonMaterial})

const Particles = () => {

    const particleRef = useRef()
    const ribbonRef = useRef()

    const [alphaMap, trailMap] = useLoader(TextureLoader, [spriteSheet, trailSheet])

    const particleSystem = useMemo(() => new ParticleSystem(), [])

    useFrame((state, delta) => {
        particleSystem.update(delta)
        particleRef.current.update()
        ribbonRef.current.update()
    });

    useEffect(() => {
        const start = particleSystem.addParticle({
            sprite: 0,
            size: 3,
            position: new Vector3(-5,2,0),
            ribbon: true,
            parent: 99,
            linewidth: 2,
            color: [1,0,0],
        })

        const end = particleSystem.addParticle({
            sprite: 0,
            size: 3,
            position: new Vector3(5,2,0),
            ribbon: true,
            parent: 99,
            linewidth: 1,
            color: [0,0,1],
        })

        return () => {
            particleSystem.destroyParticle(start)
            particleSystem.destroyParticle(end)
        }

    }, [])

    return (
        <>
            <points>
                <particleGeometry ref={particleRef} args={[particleSystem]} />
                <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}} />
            </points>
            <mesh>
                <ribbonGeometry ref={ribbonRef} args={[particleSystem]} />
                <ribbonMaterial alphaMap={trailMap} />
            </mesh>
        </>
    )

}

const Bursts = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
            <color attach="background" args={[0x131228]} />
            <OrbitControls />
            <GridPlate />
            <Particles />
        </Canvas>
    );
}

export default Bursts
