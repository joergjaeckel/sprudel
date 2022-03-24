import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {useEffect} from "react";
import {OrbitControls} from "@react-three/drei";
import {emittingSystem, livingSystem, movingSystem, ParticleRenderer, world, validateParticle} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader, Vector3} from "three";

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
                    rateOverTime: 3,
                    startLifetime: 2,
                    startSpeed: 0.1,
                    startSize: 6,
                    sprite: 11,
                    startRotation: [0, 1, 0],
                    randomizeDirection: .1,
                    colorOverLifetime: new ColorKeyframeTrack('Particle Color', [0, .25, .8], [1, 1, 1, 1, 1, 0, 1, 0, 0]),
                    opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, .2, 0.8, 1], [0, 1, .8, 0]),
                    bursts: [
                        {
                            count: 0,
                            cycleCount: -1,
                            repeatInterval: 3,
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

const Simple = () => {

    const alphaMap = useLoader(TextureLoader, spriteSheet)
    alphaMap.flipY = false
    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Emitter position={[0, 0.5, 0]}/>
            <ParticleRenderer alphaMap={alphaMap}/>
        </Canvas>
    );
}

export default Simple
