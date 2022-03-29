import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    emittingSystem,
    livingSystem,
    movingSystem,
    world,
    RibbonRenderer,
    ParticleGeometry,
    ParticleMaterial,
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import trailSheet from './assets/images/trailsheet.png'
import {TextureLoader, Vector3} from "three";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
        ref.current.update()
    });

    useEffect(() => {
        const start = world.createEntity(validateParticle({
            sprite: 0,
            size: 3,
            position: new Vector3(-5,2,0),
            ribbon: true,
            parent: 99,
            linewidth: 2,
            color: [1,0,0],
        }));

        const end = world.createEntity(validateParticle({
            sprite: 0,
            size: 3,
            position: new Vector3(5,2,0),
            ribbon: true,
            parent: 99,
            linewidth: 1,
            color: [0,0,1],
        }));

        return () => {
            world.destroyEntity(start)
            world.destroyEntity(end)
        }

    }, []);

    return (
        <points>
            <particleGeometry ref={ref} />
            <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}} />
        </points>
    )

}

const Bursts = () => {

    const [trailMap] = useLoader(TextureLoader, [trailSheet])

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
            <color attach="background" args={[0x131228]} />
            <OrbitControls />
            <GridPlate />
            <Particles />
            <RibbonRenderer alphaMap={trailMap} />
        </Canvas>
    );
}

export default Bursts
