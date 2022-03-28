import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    emittingSystem,
    livingSystem,
    movingSystem,
    world,
    ParticleGeometry,
    ParticleMaterial,
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {TextureLoader} from "three";

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
            particle: true,
            sprite: 0,
            startSize: 3,
            emitting: [
                {
                    rateOverTime: 0,
                    startLifetime: .5,
                    startSpeed: .4,
                    startSize: 5,
                    randomizeDirection: 2,
                    randomizeLifetime: .2,
                    mass: 2,
                    sprite: 1,
                    bursts: [
                        {
                            count: 20,
                            cycleCount: -1,
                            repeatInterval: 1.2,
                            time: 0,
                        }
                    ],
                    emitting: [
                        {
                            rateOverTime: 0,
                            startLifetime: 1,
                            startSpeed: 0.2,
                            startSize: 3,
                            sprite: 2,
                            randomizeDirection: .1,
                            randomizeLifetime: .4,
                            inheritVelocity: true,
                            mass: 1,
                            bursts: [
                                {
                                    count: 8,
                                    cycleCount: 1,
                                    repeatInterval: 0,
                                    time: .45,
                                }
                            ],
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
    <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
        <OrbitControls />
        <Particles />
    </Canvas>
)

export default Bursts
