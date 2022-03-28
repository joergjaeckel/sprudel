import {Canvas, extend, useFrame} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    emittingSystem,
    livingSystem,
    movingSystem,
    scalingSystem,
    world,
    validateParticle,
    ParticleGeometry,
    ParticleMaterial
} from "sprudel";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    useFrame((state, delta) => {
        emittingSystem(delta)
        movingSystem(delta)
        livingSystem(delta)
        scalingSystem(delta)
        ref.current.update()
    });

    useEffect(() => {
        const main = world.createEntity(validateParticle({
            size: 3,
            emitting: [
                {
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startRotation: [1, 1, 0],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);

    return (
        <points>
            <particleGeometry ref={ref} />
            <particleMaterial />
        </points>
    )

}

const Simple = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
            <OrbitControls/>
            <GridPlate />
            <Particles />
        </Canvas>
    );
}

export default Simple
