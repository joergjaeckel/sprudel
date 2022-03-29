import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    emittingSystem,
    livingSystem,
    movingSystem,
    fadingSystem,
    world,
    ParticleGeometry, ParticleMaterial
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {NumberKeyframeTrack, TextureLoader} from "three";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    useFrame((state, delta) => {
        emittingSystem(delta)
        movingSystem(delta)
        livingSystem(delta)
        fadingSystem(delta)
        ref.current.update()
    });

    useEffect(() => {
        const main = world.createEntity(validateParticle({
            particle: true,
            size: 3,
            emitting: [
                {
                    rateOverTime: 0,
                    startLifetime: 1,
                    startSpeed: 0.4,
                    size: 3,
                    sprite: 1,
                    randomizeDirection: 2,
                    startRotation: [0, 1, 0],
                    color: [2, 2, 2],
                    opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, .66, 1], [1, .85, 0]),
                    bursts: [
                        {
                            count: 10,
                            cycleCount: -1,
                            repeatInterval: 1,
                            time: 0,
                        }
                    ],
                    emitting: [
                        {
                            rateOverTime: 30,
                            startLifetime: 2,
                            startSpeed: 0.05,
                            size: 6,
                            sprite: 1,
                            randomizeDirection: 2,
                            mass: 0.3,
                            startRotation: [0, 0, 0],
                            color: [.6, 0, 2],
                            opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, .6, 1], [.3, .2, 0]),
                        },
                    ]
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);

    return (
        <points>
            <particleGeometry ref={ref} />
            <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}} />
        </points>
    )

}

const Bursts = () => (
    <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
        <color attach="background" args={[0x131228]} />
        <OrbitControls />
        <GridPlate />
        <Particles />
    </Canvas>
)

export default Bursts
