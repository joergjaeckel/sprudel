import {Canvas, extend, useFrame, useThree} from "@react-three/fiber";
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
import {Points} from "three";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    const {scene} = useThree()

    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
        ref.current.update()
    });

    useEffect(() => {

        const geo = new ParticleGeometry()

        ref.current = geo

        const mat = new ParticleMaterial()

        const points = new Points(geo, mat)

        scene.add(points)

        const main = world.createEntity(validateParticle({
            size: 3,
            emitting: [
                {
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    size: 3,
                    startRotation: [1, 1, 0],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);

    return null

}

const Simple = () => {

    return (
        <Canvas dpr={[1, 1.5]} camera={{position: [-10, 14, 30], fov: 50}}>
            <color attach="background" args={[0x131228]} />
            <OrbitControls/>
            <GridPlate />
            <Particles />
        </Canvas>
    );
}

export default Simple
