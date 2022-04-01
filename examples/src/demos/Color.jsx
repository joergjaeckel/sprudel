import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { validateParticle, ParticleGeometry, ParticleMaterial, ParticleSystem } from 'sprudel'
import spriteSheet from './assets/images/spritesheet.png'
import { ColorKeyframeTrack, NumberKeyframeTrack, TextureLoader } from 'three'
import GridPlate from '../GridPlate'

extend({ ParticleGeometry, ParticleMaterial })

const Particles = () => {
  const ref = useRef()

  const alphaMap = useLoader(TextureLoader, spriteSheet)

  const particleSystem = useMemo(() => new ParticleSystem(), [])

  useFrame((state, delta) => {
    particleSystem.update(delta)
    ref.current.update()
  })

  useEffect(() => {
    const main = particleSystem.addParticle({
      sprite: 0,
      size: 3,
      emitting: [
        {
          rateOverTime: 3,
          startLifetime: 2,
          startSpeed: 0.2,
          size: 6,
          sprite: 11,
          startRotation: [0, 1, 0],
          randomizeRotation: 0.1,
          mass: -2,
          colorOverLifetime: new ColorKeyframeTrack(
            'Particle Color',
            [0, 0.25, 0.8],
            [0, 0, 0.5, 0.4, 0, 1, 1, 0, 0],
          ),
          opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, 0.2, 0.8, 1], [0, 1, 0.8, 0]),
          bursts: [
            {
              count: 0,
              cycleCount: -1,
              repeatInterval: 3,
              time: 0,
            },
          ],
        },
      ],
    })

    return () => particleSystem.destroyParticle(main)
  }, [])

  return (
    <points>
      <particleGeometry ref={ref} args={[particleSystem]} />
      <particleMaterial
        alphaMap={alphaMap}
        spriteSize={{ x: 128, y: 128 }}
        spriteSheetSize={{ x: 1024, y: 1024 }}
      />
    </points>
  )
}

const Simple = () => (
  <Canvas dpr={[1, 1.5]} camera={{ position: [-10, 14, 30], fov: 50 }}>
    <color attach="background" args={[0x131228]} />
    <OrbitControls />
    <GridPlate />
    <Particles />
  </Canvas>
)

export default Simple
