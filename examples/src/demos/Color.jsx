import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    emittingSystem,
    livingSystem,
    movingSystem,
    world,
    validateParticle,
    ParticleGeometry, ParticleMaterial
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader} from "three";

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
        const main = world.createEntity(validateParticle({
            sprite: 0,
            startSize: 3,
            emitting: [
                {
                    rateOverTime: 3,
                    startLifetime: 2,
                    startSpeed: 0.2,
                    startSize: 6,
                    sprite: 11,
                    startRotation: [0, 1, 0],
                    randomizeDirection: .1,
                    mass: -2,
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

    return (
        <points>
            <particleGeometry maxCount={10000} ref={ref}/>
            <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}}/>
        </points>
    )

}

const Simple = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls />
            <Particles />
        </Canvas>
    );

}

export default Simple
