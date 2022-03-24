import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {useEffect} from "react";
import {OrbitControls} from "@react-three/drei";
import {validateParticle, emittingSystem, livingSystem, movingSystem, ParticleRenderer, world} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {TextureLoader} from "three";

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
                    rateOverTime: 0,
                    startLifetime: 2,
                    startSpeed: 0.1,
                    startSize: 3,
                    randomizeDirection: 2,
                    randomizeLifetime: .5,
                    bursts: [
                        {
                            count: 100,
                            cycleCount: -1,
                            repeatInterval: 1,
                            time: 0,
                        }
                    ],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);

    return null;
}

const Bursts = () => {

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Emitter/>
            <ParticleRenderer alphaMap={alphaMap}/>
        </Canvas>
    );
}

export default Bursts
