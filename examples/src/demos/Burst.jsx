import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {
    validateParticle,
    ParticleGeometry,
    ParticleMaterial,
    ParticleSystem,
} from "sprudel";
import spriteSheet from './assets/images/spritesheet.png'
import {ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader} from "three";
import GridPlate from "../GridPlate";

extend({ParticleGeometry, ParticleMaterial})

const Particles = () => {

    const ref = useRef()

    const alphaMap = useLoader(TextureLoader, spriteSheet)

    const particleSystem = useMemo(() => new ParticleSystem(), [])

    useFrame((state, delta) => {
        particleSystem.update(delta)
        ref.current.update()
    });

    useEffect(() => {
        const main = particleSystem.addParticle({
            particle: true,
            size: 3,
            emitting: [
                {
                    rateOverTime: 0,
                    startLifetime: 1,
                    startSpeed: 0.4,
                    size: 3,
                    sprite: 1,
                    randomizeRotation: 2,
                    startRotation: [0, 1, 0],
                    color: [2, 2, 2],
                    opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, .66, 1], [1, .85, 0]),
                    bursts: [
                        {
                            count: 8,
                            cycleCount: -1,
                            repeatInterval: 1,
                            time: 0,
                        }
                    ],
                    emitting: [
                        {
                            rateOverTime: 45,
                            startLifetime: 2,
                            startSpeed: 0.05,
                            size: 6,
                            sprite: 1,
                            randomizeRotation: 2,
                            mass: 0.3,
                            startRotation: [0, 0, 0],
                            color: [.6, 0, 2],
                            sizeOverLifetime: new NumberKeyframeTrack('Glowing Smoke Size', [0, 1], [3, 7]),
                            opacityOverLifetime: new NumberKeyframeTrack('Glowing Smoke Opacity', [0, .6, 1], [.3, .2, 0]),
                            colorOverLifetime: new ColorKeyframeTrack('Glowing Smoke Color', [0, .7], [.6, 0, 2, 0, 0, 0]),
                        },
                        {
                            rateOverTime: 20,
                            startLifetime: 1,
                            startSpeed: 0.05,
                            size: .5,
                            sprite: 12,
                            randomizeRotation: .2,
                            mass: 1.5,
                            startRotation: [0, 0, 0],
                            color: [4, 4, 4],
                            opacity: 3,
                            sizeOverLifetime: new NumberKeyframeTrack('Sparkles Size', [0, 1], [.5, 0]),
                        },
                    ]
                },
            ]
        })

        return () => particleSystem.destroyParticle(main);

    }, []);

    return (
        <points>
            <particleGeometry ref={ref} args={[particleSystem]}/>
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
