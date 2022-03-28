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
        const main = world.createEntity(validateParticle({
            size: 3,
            emitting: [
                {
                    rateOverTime: 0,
                    startLifetime: 2,
                    startSpeed: 0.2,
                    size: 2,
                    sprite: 1,
                    randomizeDirection: 2,
                    randomizeLifetime: .75,
                    randomizeSpeed: .05,
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

    return (
        <points>
            <particleGeometry ref={ref} />
            <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}} />
        </points>
    )

}

const Bursts = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
            <OrbitControls/>
            <GridPlate />
            <Particles/>
        </Canvas>
    );
}

export default Bursts
