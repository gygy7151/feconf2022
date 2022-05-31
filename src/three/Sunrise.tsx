import * as React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EFFECT_COLOR, SEGMENTS } from "../consts";
import { Vector3 } from "three";

const vertexShader = `
varying vec3 vNormal;


void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
varying vec3 vNormal;

void main() {
  float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 15.0); 
	gl_FragColor = vec4(${EFFECT_COLOR.r}, ${EFFECT_COLOR.g}, ${EFFECT_COLOR.b}, 1.0) * intensity;
}
`;
const haloFragmentShader = `
varying vec3 vNormal;

void main() {
	gl_FragColor = vec4(${EFFECT_COLOR.r}, ${EFFECT_COLOR.g}, ${EFFECT_COLOR.b}, 1.0) * (1.0 - dot(vNormal.xy, vNormal.xy));
}
`;

const sunriseVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const sunriseFragmentShader = `
varying vec2 vUv;

void main() {

  float x = 1.0 - 2.0 * abs(vUv.x - 0.5);
  float scale = x * 2.0;
	gl_FragColor = vec4(${EFFECT_COLOR.r}, ${EFFECT_COLOR.g}, ${EFFECT_COLOR.b}, 1.0) * scale;
}
`;

//   // scene.add(atmosphereMesh);
//   const haloGeometry = new THREE.SphereGeometry(0.5, 64, 64);
//   const haloMaterial = new THREE.ShaderMaterial({
//     vertexShader,
//     fragmentShader: haloFragmentShader,
//     blending: THREE.AdditiveBlending,
//     side: THREE.BackSide,
//     transparent: true,
//     depthWrite: true,
//     uniforms: {
//       uColor: { value: lightColor },
//     }
//   });
//   const haloMesh = new THREE.Mesh(
//     haloGeometry,
//     haloMaterial,
//   );
//   haloMesh.position.set(0, -0.43, -0.1);
//   haloMesh.scale.set(1.5, 1, 1);

export const Atmosphere = React.forwardRef<THREE.Mesh>((_, ref) => {
  return <mesh ref={ref}>
    <sphereGeometry args={[0.6, 64, 64]} />
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
      transparent={true}
      depthWrite={true}
    />
  </mesh>;
});

export const Halo = React.forwardRef<THREE.Mesh>((_, ref) => {
  return <mesh ref={ref} position={new Vector3(0, -0.44, -0.1)}>
    <sphereGeometry args={[0.5, 64, 64]} />
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={haloFragmentShader}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
      transparent={true}
      depthWrite={true}
    />
  </mesh>;
});

export const Sunrise = React.forwardRef<THREE.Mesh>((_, ref) => {
  return <mesh ref={ref} position={new Vector3(0, -0.28, 0)}>
    <boxGeometry args={[2.5, 0.01, 0.01, 10, 10]} />
    <shaderMaterial
      vertexShader={sunriseVertexShader}
      fragmentShader={sunriseFragmentShader}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
      transparent={true}
      depthWrite={true}
    />
  </mesh>;
});