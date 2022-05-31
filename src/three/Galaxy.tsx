import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { Vector3 } from "three";

// const galaxyGeometry = new THREE.BoxGeometry(2, 1, 1);
//   const galaxyMaterial = new THREE.MeshBasicMaterial({
//     // map: new THREE.TextureLoader().load('texture/2k_stars_milky_way.jpeg'),
//     map: new THREE.TextureLoader().load('texture/2k_stars.jpeg'),
//     side: THREE.BackSide
//   });
//   const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
//   galaxyMesh.position.set(0, 0, -100);
//   galaxyMesh.scale.set(aspect * 2, aspect * 2, aspect * 2);
//   scene.add(galaxyMesh);

export function Galaxy() {
    const texture = useLoader(THREE.TextureLoader, "texture/2k_stars.jpeg");

    return <mesh scale={new Vector3(2, 2, 2)} position={new Vector3(0, 0, -10)}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
        <boxGeometry args={[2, 1, 1]} />
    </mesh>;
}