import { Float, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import "./TravelGlobe.css";

interface TravelGlobeProps {
  agent: "lu" | "theo";
  theme: "dark" | "light";
}

const DESTINATIONS: Array<[
  string,
  [number, number, number]
]> = [
  ["Rio de Janeiro", [1.7, 0.35, 1.25]],
  ["Gramado", [1.15, -1.15, 1.35]],
  ["Lisboa", [-0.85, 1.25, 1.55]],
  ["Paris", [-1.15, 1.55, 0.75]],
  ["Nova York", [-1.85, 0.55, 0.95]],
];

function Globe({ agent }: { agent: "lu" | "theo" }) {
  const groupRef = useRef<THREE.Group>(null);
  const accent = agent === "lu" ? "#ff8068" : "#40d4df";

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#0b1a22"
          emissive={accent}
          emissiveIntensity={0.18}
          metalness={0.65}
          roughness={0.32}
        />
      </mesh>

      <mesh scale={1.08}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.055}
          side={THREE.BackSide}
        />
      </mesh>

      {[-0.8, -0.4, 0, 0.4, 0.8].map((y) => (
        <mesh key={`lat-${y}`} rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]}>
          <torusGeometry
            args={[Math.sqrt(Math.max(0.1, 1 - y * y)) * 1.8, 0.006, 8, 96]}
          />
          <meshBasicMaterial color={accent} transparent opacity={0.2} />
        </mesh>
      ))}

      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={`long-${index}`} rotation={[0, (Math.PI / 8) * index, 0]}>
          <torusGeometry args={[1.8, 0.006, 8, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.13} />
        </mesh>
      ))}

      {DESTINATIONS.map(([name, position]) => (
        <DestinationMarker key={name} position={position} color={accent} />
      ))}
    </group>
  );
}

function DestinationMarker({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 3 + position[0]) * 0.18;
      markerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function GlobeOrbit({ agent }: { agent: "lu" | "theo" }) {
  const ref = useRef<THREE.Group>(null);
  const accent = agent === "lu" ? "#ff8068" : "#40d4df";

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.18;
      ref.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={ref} rotation={[0.45, 0.15, -0.35]}>
      <mesh>
        <torusGeometry args={[2.35, 0.008, 12, 160]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>
      <mesh position={[2.35, 0, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function ParticleField({ agent }: { agent: "lu" | "theo" }) {
  const ref = useRef<THREE.Points>(null);
  const accent = agent === "lu" ? "#ff8068" : "#40d4df";
  const positions = useMemo(() => {
    const array = new Float32Array(300 * 3);
    for (let index = 0; index < 300; index += 1) {
      const seed = (index * 9301 + 49297) % 233280;
      const x = seed / 233280;
      const y = ((seed * 17) % 233280) / 233280;
      const z = ((seed * 31) % 233280) / 233280;

      array[index * 3] = (x - 0.5) * 10;
      array[index * 3 + 1] = (y - 0.5) * 7;
      array[index * 3 + 2] = (z - 0.5) * 7;
    }
    return array;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012;
      ref.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color={accent} size={0.025} transparent opacity={0.65} />
    </points>
  );
}

function TravelScene({
  agent,
  theme,
}: TravelGlobeProps) {
  const accent = agent === "lu" ? "#ff8068" : "#40d4df";

  return (
    <>
      <ambientLight intensity={theme === "dark" ? 0.5 : 0.8} />
      <pointLight position={[4, 4, 5]} intensity={2} color={accent} />
      <pointLight position={[-4, -2, 3]} intensity={1} color="#ffffff" />

      <Stars
        radius={10}
        depth={5}
        count={350}
        factor={1.5}
        saturation={0}
        fade
        speed={0.35}
      />

      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.15}>
        <Globe agent={agent} />
        <GlobeOrbit agent={agent} />
      </Float>

      <ParticleField agent={agent} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  );
}

export default function TravelGlobe({ agent, theme }: TravelGlobeProps) {
  return (
    <div className="travel-globe" data-agent={agent} data-theme={theme}>
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <TravelScene agent={agent} theme={theme} />
      </Canvas>
      <div className="travel-globe-glow" />
      <div className="travel-globe-label">
        <span>BORA EMBORA</span>
        <strong>explore</strong>
      </div>
    </div>
  );
}
