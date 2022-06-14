import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas, ThreeCanvasObject } from "./ThreeCanvas";

const DEFAULT_VELOCITY = 0.007;
const LINE_COUNT = 3000;

export const WarpLine = () => {
    const threeCanvasRef = useRef<ThreeCanvasObject>(null);
    const velocityRef = useRef(DEFAULT_VELOCITY);

    const [attributes] = useState(() => {
        const position = new THREE.BufferAttribute(new Float32Array(6 * LINE_COUNT), 3);
        const velocities = new THREE.BufferAttribute(new Float32Array(2 * LINE_COUNT), 1);
        const positionArray = position.array as number[];
        const velocitiesArray = velocities.array as number[];

        for (let lineIndex = 0; lineIndex < LINE_COUNT; ++lineIndex) {
            const rad = Math.random() * Math.PI * 2;
            const lineRadius = 20 + (Math.random() * 20);
            const lineX = lineRadius * Math.cos(rad);
            const lineY = lineRadius * Math.sin(rad);
            const lineZ = Math.random() * 500 - 100;
            //line start to End
            positionArray[6 * lineIndex + 3] = positionArray[6 * lineIndex] = lineX;
            positionArray[6 * lineIndex + 4] = positionArray[6 * lineIndex + 1] = lineY;
            positionArray[6 * lineIndex + 5] = positionArray[6 * lineIndex + 2] = lineZ;
            velocitiesArray[2 * lineIndex] = velocitiesArray[2 * lineIndex + 1] = 0;
        }
        return {
            position,
            velocities,
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
        scene.add(galaxyMesh);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", attributes.position);
        lineGeometry.setAttribute("velocity", attributes.velocities);

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineObject = new THREE.LineSegments(lineGeometry, lineMaterial);

        scene.add(lineObject);

        lineObject.matrixAutoUpdate = false;
        lineObject.matrix.makePerspective(-1, 1, 1, -1, 0.5, -100);

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

    return <ThreeCanvas ref={threeCanvasRef} render={true} onRender={() => {
        const velocity = velocityRef.current;

        velocityRef.current = velocity - (velocity - DEFAULT_VELOCITY) * 0.05;
        const {
            velocities,
            position,
        } = attributes;
        const positionArray = position.array as number[];
        const velocitiesArray = velocities.array as number[];
        for (let lineIndex = 0; lineIndex < LINE_COUNT; ++lineIndex) {
            velocitiesArray[2 * lineIndex] = 100 * velocity;
            velocitiesArray[2 * lineIndex + 1] = 100 * (velocity + velocity * 0.014);

            // z
            positionArray[6 * lineIndex + 2] += velocitiesArray[2 * lineIndex];
            positionArray[6 * lineIndex + 5] += velocitiesArray[2 * lineIndex + 1];

            // (-100 ~ 100) to 200
            if (positionArray[6 * lineIndex + 5] > 100) {
                const z = Math.random() * 200 - 100;

                positionArray[6 * lineIndex + 2] = z;
                positionArray[6 * lineIndex + 5] = z;
                velocitiesArray[2 * lineIndex] = 0;
                velocitiesArray[2 * lineIndex + 1] = 0;
            }
            // (-200
            if (positionArray[6 * lineIndex + 5] < -100) {
                const z = Math.random() * 200 - 100;

                positionArray[6 * lineIndex + 2] = z;
                positionArray[6 * lineIndex + 5] = z;
                velocitiesArray[2 * lineIndex] = 0;
                velocitiesArray[2 * lineIndex + 1] = 0;
            }
        }
        position.needsUpdate = true;
    }}></ThreeCanvas>;
};