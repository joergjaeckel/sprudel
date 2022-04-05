import {Canvas, extend, useFrame, useLoader, useThree} from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { ParticleGeometry, ParticleMaterial, ParticleSystem } from 'sprudel'
import {NumberKeyframeTrack, TextureLoader, Vector3} from 'three'
import spriteSheet from './assets/images/spritesheet.png'
import GridPlate from '../GridPlate'

extend({ ParticleGeometry, ParticleMaterial })

const Particles = () => {
  const ref = useRef<ParticleGeometry>()

  const alphaMap = useLoader(TextureLoader, spriteSheet)

  const { scene } = useThree()

  const particleSystem = useMemo(() => new ParticleSystem(scene), [])

  useFrame((state, delta) => {
    particleSystem.update(delta)
    ref.current?.update()
  })

  useEffect(() => {
    const main = particleSystem.addParticle({
      size: 3,
      position: new Vector3(0,1,0),
      emitting: [
        {
          rateOverTime: 5,
          startLifetime: 10,
          startSpeed: 0.25,
          size: 2,
          sprite: 1,
          randomizeRotation: 2,
          speedModifier: .99,
          startRotation: [0.2, 0, -1],
          color: [2, 2, 2],
          mass: 1,
          opacityOverLifetime: new NumberKeyframeTrack('Particle Opacity', [0, 0.66, 1], [1, 0.85, 0]),
          collide: true,
          bursts: [
            {
              count: 50,
              cycleCount: -1,
              repeatInterval: 1,
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
      <particleGeometry ref={ref} args={[particleSystem.world]} />
      <particleMaterial
        alphaMap={alphaMap}
        spriteSize={{ x: 128, y: 128 }}
        spriteSheetSize={{ x: 1024, y: 1024 }}
      />
    </points>
  )
}

const Bursts = () => (
  <Canvas dpr={[1, 1.5]} camera={{ position: [-10, 14, 30], fov: 50 }}>
    <color attach="background" args={[0x131228]} />
    <OrbitControls />
    <GridPlate />
    <Particles />
    <mesh onUpdate={object => object.layers.enable( 1 )} position={[3,1.5,3]}>
      <boxBufferGeometry args={[2,3,2]}/>
      <meshNormalMaterial />
    </mesh>
    <mesh onUpdate={object => object.layers.enable( 1 )} position={[-3,1.5,-2]} rotation-y={Math.PI/4}>
      <boxBufferGeometry args={[5,3,3]}/>
      <meshNormalMaterial />
    </mesh>
    <mesh onUpdate={object => object.layers.enable( 1 )} position={[5,-10,-10]} rotation-x={Math.PI/4}>
      <boxBufferGeometry args={[5,3,5]}/>
      <meshNormalMaterial />
    </mesh>
  </Canvas>
)

export default Bursts
