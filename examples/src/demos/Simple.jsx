import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    emittingSystem,
    livingSystem,
    movingSystem,
    world,
    validateParticle,
    ParticleGeometry,
    ParticleMaterial
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
            startSize: 3,
            emitting: [
                {
                    sprite: 1,
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
            <OrbitControls/>
            <Particles />
        </Canvas>
    );
}

export default Simple
