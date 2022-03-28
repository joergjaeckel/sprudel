
export default () => (
    <>
        <polarGridHelper args={[10, 8, 3, 64, 0x610AA5, 0x0B1E7A]}/>
        <mesh rotation-x={-Math.PI/2} position-y={-.1}>
            <circleBufferGeometry args={[10, 64]} />
            <meshBasicMaterial color={0x351972} />
        </mesh>
    </>
)
