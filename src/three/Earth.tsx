import * as React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

export interface EarthProps {
    onReady(): void;
}

export const Cloud = React.forwardRef<THREE.Mesh>((_, ref) => {
    const [cloudTexture, setCloudTexture] = React.useState(useLoader(THREE.TextureLoader, "texture/2k_earth_clouds.jpeg"));

    (window as any).setCloudTexture = React.useCallback((src: any) => {
        setCloudTexture(new TextureLoader().load(src));
    }, []);
    React.useEffect(() => {
        const mesh = (ref! as React.RefObject<THREE.Mesh>).current!;

        mesh.rotateX(-0.4);
        mesh.rotateY(2.4);


        const cloudFile = document.querySelector<HTMLInputElement>("#cloudFile")!;

        cloudFile.addEventListener("change", () => {
            const file = cloudFile.files![0];
            const reader = new FileReader();
            reader.addEventListener("load", e => {
                setCloudTexture(new TextureLoader().load(e.target!.result as any));
            });
            reader.readAsDataURL(file);
        });
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
    const [earthTexture, setEarthTexture] = React.useState(useLoader(THREE.TextureLoader, "texture/earth.jpeg"));
    const normalTexture = useLoader(THREE.TextureLoader, "texture/2k_earth_normal_map.png");
    const specularTexture = useLoader(THREE.TextureLoader, "texture/2k_earth_specular_map.png");



    React.useEffect(() => {
        props.onReady();
        const mesh = (ref! as React.RefObject<THREE.Mesh>).current!;

        mesh.rotateX(-0.4);
        mesh.rotateY(2.4);

        const earthFile = document.querySelector<HTMLInputElement>("#earthFile")!;

        earthFile.addEventListener("change", () => {
            const file = earthFile.files![0];
            const reader = new FileReader();
            reader.addEventListener("load", e => {
                setEarthTexture(new TextureLoader().load(e.target!.result as any));
            });
            reader.readAsDataURL(file);
        });
    }, []);
    return <mesh ref={ref}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshPhongMaterial
            map={earthTexture}
            normalMap={normalTexture}
            specularMap={specularTexture}
            normalScale={new THREE.Vector2(-2, -2)}

            transparent={true}
            depthWrite={true}
        />
    </mesh>;
});