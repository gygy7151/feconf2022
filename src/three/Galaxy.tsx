import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { Vector3 } from "three";

export function Galaxy() {
    const texture = useLoader(THREE.TextureLoader, "texture/2k_stars.jpeg");

    return <mesh scale={new Vector3(2, 2, 2)} position={new Vector3(0, 0, -10)}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
        <boxGeometry args={[2, 1, 1]} />
    </mesh>;
}