import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LineSegments } from "three";


export function WarpLine() {
    const lineCount = 3000;
    const lineRef = useRef<THREE.LineSegments>(null);
    const [attributes] = useState(() => {
        const position = new THREE.BufferAttribute(new Float32Array(6 * lineCount), 3);
        const velocities = new THREE.BufferAttribute(new Float32Array(2 * lineCount), 1);
        const positionArray = position.array as number[];
        const velocitiesArray = velocities.array as number[];

        for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
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
        lineRef.current!.matrixAutoUpdate = false;
        lineRef.current!.matrix.makePerspective(-1, 1, 1, -1, 0.5, -100);
    }, []);
    useFrame(() => {
        const {
            velocities,
            position,
        } = attributes;
        const positionArray = position.array as number[];
        const velocitiesArray = velocities.array as number[];
        for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
            velocitiesArray[2 * lineIndex] += 0.007;
            velocitiesArray[2 * lineIndex + 1] += 0.0071;

            // z
            positionArray[6 * lineIndex + 2] += velocitiesArray[2 * lineIndex];
            positionArray[6 * lineIndex + 5] += velocitiesArray[2 * lineIndex + 1];

            if (positionArray[6 * lineIndex + 5] > 200) {
                const z = Math.random() * 200 - 100;

                positionArray[6 * lineIndex + 2] = z;
                positionArray[6 * lineIndex + 5] = z;
                velocitiesArray[2 * lineIndex] = 0;
                velocitiesArray[2 * lineIndex + 1] = 0;
            }
        }
        position.needsUpdate = true;
    });

    return <lineSegments ref={lineRef}>
        <bufferGeometry attributes={attributes} />
        <lineBasicMaterial color={0xffffff} />
    </lineSegments>;
}