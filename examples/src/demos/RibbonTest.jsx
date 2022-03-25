import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {useEffect} from "react";
import {OrbitControls} from "@react-three/drei";
import {validateParticle, emittingSystem, livingSystem, movingSystem, ParticleRenderer, world, RibbonRenderer} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import trailSheet from './assets/images/trailsheet.png'
import {TextureLoader, Vector3} from "three";

const Emitter = () => {

    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
    });

    useEffect(() => {

        const start = world.createEntity(validateParticle({
            sprite: 0,
            startSize: 3,
            position: new Vector3(-5,0,0),
            ribbon: true,
            parent: 99,
            linewidth: 2,
            color: [1,0,0],
        }));

        const end = world.createEntity(validateParticle({
            sprite: 0,
            startSize: 3,
            position: new Vector3(5,0,0),
            ribbon: true,
            parent: 99,
            linewidth: 1,
            color: [0,0,0],
        }));

        return () => {
            world.destroyEntity(start)
            world.destroyEntity(end)
        }

    }, []);

    return null;
}

const Bursts = () => {

    const [alphaMap, trailMap] = useLoader(TextureLoader, [spriteSheet, trailSheet])

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Emitter/>
            <ParticleRenderer alphaMap={alphaMap} />
            <RibbonRenderer alphaMap={trailMap} />
        </Canvas>
    );
}

export default Bursts
