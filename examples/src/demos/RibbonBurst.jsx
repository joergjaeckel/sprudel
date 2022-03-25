import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {useEffect} from "react";
import {OrbitControls} from "@react-three/drei";
import {validateParticle, emittingSystem, livingSystem, movingSystem, ParticleRenderer, world, RibbonRenderer} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {TextureLoader} from "three";
import trailSheet from "./assets/images/trailsheet.png";

const Emitter = () => {

    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
    });

    useEffect(() => {

        const main = world.createEntity(validateParticle({
            sprite: 0,
            startSize: 3,
            emitting: [
                {
                    particle: false,
                    rateOverTime: 0,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startSize: 2,
                    randomizeDirection: 2,
                    randomizeLifetime: 1,
                    randomizeSpeed: .1,
                    bursts: [
                        {
                            count: 16,
                            cycleCount: -1,
                            repeatInterval: .75,
                            time: 0,
                        }
                    ],
                    emitting: [
                        {
                            particle: false,
                            rateOverTime: 30,
                            startLifetime: 1,
                            startSpeed: 0,
                            startSize: 3,
                            mass: 0.1,
                            linewidth: .5,
                            ribbon: true,
                        },
                    ]
                },
            ]
        }));

        return () => world.destroyEntity(main);

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
