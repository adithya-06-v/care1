import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';

/** Subtle motion to suggest tongue movement (practice visualization). */
function TongueModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = Math.sin(t * 0.9) * 0.12;
    m.rotation.y = Math.sin(t * 0.7) * 0.18;
    m.position.z = Math.sin(t * 1.1) * 0.12;
    const pulse = 1 + Math.sin(t * 1.4) * 0.05;
    m.scale.set(1.35 * pulse, 0.75 * pulse, 0.95 * pulse);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial color="#f9a8d4" roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

export default function TongueExercise3D() {
  return (
    <div className="h-[350px] w-full min-h-[280px] bg-zinc-900">
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#18181b']} />
        <ambientLight intensity={0.55} />
        <pointLight position={[8, 10, 8]} intensity={1.1} />
        <pointLight position={[-6, 4, 4]} intensity={0.4} color="#fda4af" />
        <TongueModel />
        <OrbitControls
          enablePan={false}
          minDistance={2.8}
          maxDistance={7}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 1.45}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
