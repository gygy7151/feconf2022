import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas, ThreeCanvasObject } from "./ThreeCanvas";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";
import { EFFECT_COLOR } from "../consts";
import { Mesh } from "three";

const DEFAULT_VELOCITY = 0.007;
const LINE_COUNT = 1000;


const normalVertexShader = `
varying vec3 vNormal;


void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const nebulaFragmentShader = `
varying vec3 vNormal;

void main() {
  float intensity = floor(dot(vNormal, vec3(0.0, 0.0, 1.0)) * 20.0) * 0.05;

	gl_FragColor = vec4(${EFFECT_COLOR.r}, ${EFFECT_COLOR.g}, ${EFFECT_COLOR.b}, 0.3) * intensity;
}
`;

const blurVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const blurFragmentShader = `
varying vec2 vUv;

void main() {

  float x = 1.0 - 2.0 * abs(vUv.x - 0.5);
  float scale = x * 2.0;
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * scale;
}
`;

export function getBlurLineMesh() {
    const blurLineGeometry = new THREE.PlaneBufferGeometry(1, 0.05, 10, 10);
    const blurLineMaterial = new THREE.ShaderMaterial({
        vertexShader: blurVertexShader,
        fragmentShader: blurFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
    });
    const blurLineMesh = new THREE.Mesh(
        blurLineGeometry,
        blurLineMaterial,
    );
    return blurLineMesh;
}

export function getNebulaMesh() {
    const geometry = new THREE.SphereGeometry(0.3, 128, 128);
    const nebulaMaterial = new THREE.ShaderMaterial({
        vertexShader: normalVertexShader,
        fragmentShader: nebulaFragmentShader,
        blending: THREE.AdditiveBlending,
        // side: THREE.BackSide,
        transparent: true,
        depthWrite: true,
    });
    const mesh = new THREE.Mesh(geometry, nebulaMaterial);
    const perlin = new ImprovedNoise();
    const verties = geometry.attributes.position.array as number[];

    const noiseScale = 3 + Math.random() * 3;
    for (let i = 0; i < verties.length / 3; ++i) {
        const x = verties[3 * i];
        const y = verties[3 * i + 1];
        const z = verties[3 * i + 2];

        const scale = 1 + perlin.noise(x * noiseScale, y * noiseScale, z * noiseScale);

        verties[3 * i] *= scale;
        verties[3 * i + 1] *= scale;
        verties[3 * i + 2] *= scale;
    }

    mesh.scale.set(3, 3, 3);

    return mesh;
}


export const WarpLine = () => {
    const threeCanvasRef = useRef<ThreeCanvasObject>(null);
    const velocityRef = useRef(DEFAULT_VELOCITY);
    const linesRef = useRef<Mesh[]>([]);

    const [attributes] = useState(() => {
        const position = new THREE.BufferAttribute(new Float32Array(6 * LINE_COUNT), 3);
        const positionArray = position.array as number[];

        for (let lineIndex = 0; lineIndex < LINE_COUNT; ++lineIndex) {
            const rad = Math.random() * Math.PI * 2;
            const lineRadius = 10 + (Math.random() * 20);
            const lineX = lineRadius * Math.cos(rad);
            const lineY = lineRadius * Math.sin(rad);
            const lineZ = Math.random() * 500 - 100;
            //line start to End
            positionArray[6 * lineIndex + 3] = positionArray[6 * lineIndex] = lineX;
            positionArray[6 * lineIndex + 4] = positionArray[6 * lineIndex + 1] = lineY;
            positionArray[6 * lineIndex + 5] = positionArray[6 * lineIndex + 2] = lineZ;
        }
        return {
            position,
        };
    });
    useEffect(() => {
        const scene = threeCanvasRef.current!.sceneRef.current!;

        const galaxyGeometry = new THREE.BoxGeometry(2, 1, 1);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            // map: new THREE.TextureLoader().load('texture/2k_stars_milky_way.jpeg'),
            map: new THREE.TextureLoader().load('texture/2k_stars.jpeg'),
            side: THREE.BackSide
        });
        const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        galaxyMesh.position.set(0, 0, -10);
        galaxyMesh.scale.set(2, 2, 2);
        // scene.add(galaxyMesh);

        // const lineGeometry = new THREE.BufferGeometry();
        // lineGeometry.setAttribute("position", attributes.position);

        // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        // const lineObject = new THREE.LineSegments(lineGeometry, lineMaterial);

        // scene.add(lineObject);

        for (let i = 0; i < LINE_COUNT; ++i) {
            const line = getBlurLineMesh();
            const lineRad = Math.random() * Math.PI * 2;
            const lineRadius = 10 + (Math.random() * 20);
            const lineX = lineRadius * Math.cos(lineRad);
            const lineY = lineRadius * Math.sin(lineRad);
            const lineZ = Math.random() * 200 - 100;

            line.rotateZ(lineRad);
            line.position.set(lineX, lineY, lineZ);
            
            scene.add(line);        

            linesRef.current.push(line);
        }

        // lineObject.matrixAutoUpdate = false;

        let scrollTop = 0;
        function onScroll() {
            const prevScrollTop = scrollTop;

            scrollTop = document.documentElement.scrollTop;

            const sign = scrollTop - prevScrollTop > 0;

            velocityRef.current += sign ? 0.001 : -0.002;
        }
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);

    return <ThreeCanvas perspective={true} ref={threeCanvasRef} render={true} onRender={() => {
        const velocity = velocityRef.current;
        const lines = linesRef.current;

        velocityRef.current = velocity - (velocity - DEFAULT_VELOCITY) * 0.05;
        const {
            position,
        } = attributes;
        
        const positionArray = position.array as number[];

        lines.forEach(line => {
            const position = line.position;
            let z = line.position.z + 100 * velocity;

            if (z > 100) {
                z = -100;
            }
            if (z < -100) {
                z = 100;
            }
            line.position.set(position.x, position.y, z);
        });
        // for (let lineIndex = 0; lineIndex < LINE_COUNT; ++lineIndex) {
        //     const head = 100 * (velocity + velocity * 0.014);
        //     const tail = 100 * velocity;

        //     // z
        //     positionArray[6 * lineIndex + 2] += tail;
        //     positionArray[6 * lineIndex + 5] += head;
        //     // positionArray[6 * lineIndex + 2] = -25;
        //     // positionArray[6 * lineIndex + 5] = -20;

        //     // console.log(positionArray[6 * lineIndex + 2]);

        //     // (-100 ~ 100) to 200
        //     if (positionArray[6 * lineIndex + 5] > 100) {
        //         const z = Math.random() * 200 - 100;

        //         positionArray[6 * lineIndex + 2] = z;
        //         positionArray[6 * lineIndex + 5] = z;
        //     }
        //     // (-200
        //     if (positionArray[6 * lineIndex + 5] < -100) {
        //         const z = Math.random() * 200 - 100;

        //         positionArray[6 * lineIndex + 2] = z;
        //         positionArray[6 * lineIndex + 5] = z;
        //     }
        // }
        // position.needsUpdate = true;
    }}></ThreeCanvas>;
};