import {Canvas, useFrame, useLoader, extend} from "@react-three/fiber";
import {Suspense, useEffect, useRef, useState} from "react";
import {OrbitControls} from "@react-three/drei";
import {emittingSystem, livingSystem, movingSystem, world, validateParticle, ParticleRenderer} from "sprudel";
import spriteSheet from './assets/images/checker.png'
import {ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader, Vector3} from "three";

extend({ParticleRenderer})

const Particles = () => {

    const ref = useRef()

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
        ref.current.geometry.update()
    });

    useEffect(() => {
        const main = world.createEntity(validateParticle({
            sprite: 0,
            startSize: 3,
            emitting: [
                {
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startSize: 3,
                    startRotation: [1, 1, 0],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);

    return <particleRenderer ref={ref} alphaMap={alphaMap} maxCount={10000}/>;
}

const Simple = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Suspense fallback={null}>
                <Particles />
            </Suspense>
        </Canvas>
    );
}

export default Simple
