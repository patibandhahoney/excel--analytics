import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

function BarMesh({ position, height, color }) {
  const meshRef = useRef(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export const Chart3D = ({ data }) => {
  // Add safety checks for data
  if (!data || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-muted-foreground">No data available for 3D visualization</p>
        </div>
      </div>
    );
  }

  const chartData = data.datasets[0].data;
  const maxValue = chartData.length > 0 ? Math.max(...chartData) : 1;
  const color = data.datasets[0].borderColor || 'hsl(240, 100%, 25%)';
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        
        {/* Render 3D bars */}
        {chartData.slice(0, 8).map((value, index) => (
          <BarMesh
            key={index}
            position={[index * 1.2 - 4, (value / maxValue) * 2, 0]}
            height={(value / maxValue) * 4}
            color={color}
          />
        ))}
        
        {/* Add title */}
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="hsl(240, 100%, 25%)"
          anchorX="center"
          anchorY="middle"
        >
          3D Data Visualization
        </Text>
        
        {/* Add grid */}
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};