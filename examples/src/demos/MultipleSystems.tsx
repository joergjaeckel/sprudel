import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { ParticleGeometry, ParticleMaterial, ParticleSystem } from 'sprudel'
import { NumberKeyframeTrack, Vector3 } from 'three'
import GridPlate from '../GridPlate'

extend({ ParticleGeometry, ParticleMaterial })

const Particles = ({
  position,
  color,
}: {
  position: [number, number, number]
  color: [number, number, number]
}) => {
  const ref = useRef<ParticleGeometry>()

  const particleSystem = useMemo(() => new ParticleSystem(), [])

  useFrame((state, delta) => {
    particleSystem.update(delta)
    ref.current?.update()
  })

  useEffect(() => {
    const main = particleSystem.addParticle({
      size: 3,
      position: new Vector3(...position),
      color,
      emitting: [
        {
          color,
          sprite: 1,
          rateOverTime: 10,
          startLifetime: 2,
          startSpeed: 0.3,
          startRotation: [0, 1, 0],
          randomizeRotation: 1.5,
          sizeOverLifetime: new NumberKeyframeTrack('Particle Size', [0, 0.2, 1], [0, 1, 0]),
        },
      ],
    })

    return () => particleSystem.destroyParticle(main)
  }, [])

  return (
    <points>
      <particleGeometry args={[particleSystem.world]} ref={ref} />
      <particleMaterial />
    </points>
  )
}

const Simple = () => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [-10, 14, 30], fov: 50 }}>
      <color attach="background" args={[0x131228]} />
      <OrbitControls />
      <GridPlate />
      <Particles position={[5, 1, 0]} color={[1, 0, 0]} />
      <Particles position={[-5, 1, 0]} color={[0, 0, 1]} />
    </Canvas>
  )
}

export default Simple
