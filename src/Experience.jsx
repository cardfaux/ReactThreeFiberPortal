import { shaderMaterial, Sparkles, Center, useTexture, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ffffff'),
    uColorEnd: new THREE.Color('#000000'),
  },
  portalVertexShader,
  portalFragmentShader
);

//* use the extend function to add the custom shader to the global scope, to use as a JSX element like portalMaterial
extend({ PortalMaterial });

export default function Experience() {
  const { nodes } = useGLTF('./model/portal.glb');

  const bakedTexture = useTexture('./model/baked.jpg');
  bakedTexture.flipY = false;

  const portalMaterial = useRef();

  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  const model = useGLTF('./model/chocker.glb');
  const plug = useGLTF('./model/plug.glb');

  console.log(model);

  return (
    <>
      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>
        <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
          <meshBasicMaterial color='#ffffe5' />
        </mesh>
        <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
          <meshBasicMaterial color='#ffffe5' />
        </mesh>
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>
        <Sparkles size={6} scale={[4, 2, 4]} position-y={1} speed={0.2} count={40} />
        <primitive object={model.scene} scale={0.2} position={[0, 0.1, -0.5]} rotation={[0, 0, 1]} />
        <primitive object={plug.scene} scale={0.2} position={[0, 0.5, -0.5]} rotation={[0, 0, 1]} />
      </Center>

      {/* <primitive object={model.scene} scale={0.2} /> */}
    </>
  );
}
