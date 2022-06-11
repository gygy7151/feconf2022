import * as React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export interface EarthProps {
    onReady(): void;
}

export const Cloud = React.forwardRef<THREE.Mesh>((_, ref) => {
    const cloudTexture = useLoader(THREE.TextureLoader, "texture/2k_earth_clouds.jpeg");

    React.useEffect(() => {
        const mesh = (ref! as React.RefObject<THREE.Mesh>).current!;

        mesh.rotateX(-0.4);
        mesh.rotateY(2.4);
    }, [ref]);

    return <mesh ref={ref}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshPhongMaterial
            map={cloudTexture}
            side={THREE.DoubleSide}
            opacity={0.5}
            transparent={true}
            depthWrite={true}
        />
    </mesh>;
});

export const Earth = React.forwardRef<THREE.Mesh, EarthProps>((props, ref) => {
    const earthTexture = useLoader(THREE.TextureLoader, "texture/earth.jpeg");
    const normalTexture = useLoader(THREE.TextureLoader, "texture/2k_earth_normal_map.png");
    const specularTexture = useLoader(THREE.TextureLoader, "texture/2k_earth_specular_map.png");


    React.useEffect(() => {
        props.onReady();
        const mesh = (ref! as React.RefObject<THREE.Mesh>).current!;

        mesh.rotateX(-0.4);
        mesh.rotateY(2.4);
    }, [ref]);
    return <mesh ref={ref}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshPhongMaterial
            map={earthTexture}
            // normalMap={normalTexture}
            // specularMap={specularTexture}
            normalScale={new THREE.Vector2(-2, -2)}
        />
    </mesh>;
});