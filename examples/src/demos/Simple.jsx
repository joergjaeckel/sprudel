import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {Suspense, useEffect, useState} from "react";
import {OrbitControls} from "@react-three/drei";
import {emittingSystem, livingSystem, movingSystem, ParticleRenderer, world, validateParticle} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader, Vector3} from "three";

const Emitter = ({position}) => {

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

    return null;
}

const Simple = () => {

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Emitter position={[0, 0.5, 0]}/>
            <ParticleRenderer alphaMap={alphaMap}/>
        </Canvas>
    );
}

export default Simple
