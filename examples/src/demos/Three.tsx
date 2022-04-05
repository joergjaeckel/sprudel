import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { ParticleGeometry, ParticleMaterial, ParticleSystem } from 'sprudel'
import { Points } from 'three'
import GridPlate from '../GridPlate'

extend({ ParticleGeometry, ParticleMaterial })

const Particles = () => {
  const ref = useRef<ParticleGeometry>()

  const { scene } = useThree()

  const particleSystem = useMemo(() => new ParticleSystem(), [])

  useFrame((state, delta) => {
    particleSystem.update(delta)
    ref.current?.update()
  })

  useEffect(() => {
    const geo = new ParticleGeometry(particleSystem.world)

    ref.current = geo

    const mat = new ParticleMaterial()

    const points = new Points(geo, mat)

    scene.add(points)

    const main = particleSystem.addParticle({
      size: 3,
      emitting: [
        {
          rateOverTime: 10,
          startLifetime: 2,
          startSpeed: 0.3,
          size: 3,
          startRotation: [1, 1, 0],
        },
      ],
    })

    return () => particleSystem.destroyParticle(main)
  }, [])

  return null
}

const Simple = () => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [-10, 14, 30], fov: 50 }}>
      <color attach="background" args={[0x131228]} />
      <OrbitControls />
      <GridPlate />
      <Particles />
    </Canvas>
  )
}

export default Simple
