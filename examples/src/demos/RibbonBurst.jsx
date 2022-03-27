import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    emittingSystem,
    livingSystem,
    movingSystem,
    world,
    RibbonRenderer,
    ParticleGeometry, ParticleMaterial
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {TextureLoader} from "three";
import trailSheet from "./assets/images/trailsheet.png";

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

    return (
        <points>
            <particleGeometry maxCount={10000} ref={ref}/>
            <particleMaterial alphaMap={alphaMap} spriteSize={{x: 128, y: 128}} spriteSheetSize={{x: 1024, y: 1024}}/>
        </points>
    )

}

const Bursts = () => {

    const [trailMap] = useLoader(TextureLoader, [trailSheet])

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 10, 30], fov: 50}}>
            <OrbitControls/>
            <Particles />
            <RibbonRenderer alphaMap={trailMap} />
        </Canvas>
    );
}

export default Bursts
