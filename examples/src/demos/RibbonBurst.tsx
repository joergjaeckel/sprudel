import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { ParticleSystem, ParticleGeometry, ParticleMaterial, RibbonGeometry, RibbonMaterial } from 'sprudel'
import spriteSheet from './assets/images/spritesheet.png'
import { TextureLoader } from 'three'
import trailSheet from './assets/images/trailsheet.png'
import GridPlate from '../GridPlate'

extend({ ParticleGeometry, ParticleMaterial, RibbonGeometry, RibbonMaterial })

const Particles = () => {
  const particleRef = useRef<ParticleGeometry>()
  const ribbonRef = useRef<RibbonGeometry>()

  const [alphaMap, trailMap] = useLoader(TextureLoader, [spriteSheet, trailSheet])

  const particleSystem = useMemo(() => new ParticleSystem(), [])

  useFrame((state, delta) => {
    particleSystem.update(delta)
    particleRef.current?.update()
    ribbonRef.current?.update()
  })

  useEffect(() => {
    const main = particleSystem.addParticle({
      sprite: 0,
      size: 3,
      emitting: [
        {
          hideParticle: true,
          rateOverTime: 0,
          startLifetime: 2,
          startSpeed: 0.3,
          size: 2,
          randomizeRotation: 2,
          randomizeLifetime: 1,
          randomizeSpeed: 0.1,
          bursts: [
            {
              count: 16,
              cycleCount: -1,
              repeatInterval: 0.75,
              time: 0,
            },
          ],
          emitting: [
            {
              hideParticle: true,
              rateOverTime: 30,
              startLifetime: 1,
              startSpeed: 0,
              size: 3,
              mass: 0.1,
              linewidth: 0.5,
              ribbon: true,
            },
          ],
        },
      ],
    })

    return () => particleSystem.destroyParticle(main)
  }, [])

  return (
    <>
      <points>
        <particleGeometry ref={particleRef} args={[particleSystem.world]} />
        <particleMaterial
          alphaMap={alphaMap}
          spriteSize={{ x: 128, y: 128 }}
          spriteSheetSize={{ x: 1024, y: 1024 }}
        />
      </points>
      <mesh>
        <ribbonGeometry ref={ribbonRef} args={[particleSystem.world]} />
        <ribbonMaterial alphaMap={trailMap} />
      </mesh>
    </>
  )
}

const Bursts = () => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [-10, 14, 30], fov: 50 }}>
      <color attach="background" args={[0x131228]} />
      <OrbitControls />
      <GridPlate />
      <Particles />
    </Canvas>
  )
}

export default Bursts
