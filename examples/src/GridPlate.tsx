export default () => (
  <>
    <polarGridHelper args={[10, 8, 3, 64, 0x610aa5, 0x0b1e7a]} />
    <mesh rotation-x={-Math.PI / 2} position-y={-0.1} onUpdate={object => object.layers.enable( 1 )}>
      <circleBufferGeometry args={[10, 64]} />
      <meshBasicMaterial color={0x351972} />
    </mesh>
  </>
)
