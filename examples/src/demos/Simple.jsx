import {Canvas, extend, useFrame} from "@react-three/fiber";
import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    ParticleGeometry,
    ParticleMaterial,
    ParticleSystem,
} from "sprudel";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    const particleSystem = useMemo(() => new ParticleSystem(), [])

    useFrame((state, delta) => {
        particleSystem.update(delta)
        ref.current.update()
    });

    useEffect(() => {
        const main = particleSystem.addParticle({
            size: 3,
            emitting: [
                {
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startRotation: [1, 1, 0],
                },
            ]
        })

        return () => particleSystem.destroyParticle(main)

    }, []);

    return (
        <points>
            <particleGeometry ref={ref} args={[particleSystem]}/>
            <particleMaterial />
        </points>
    )

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
