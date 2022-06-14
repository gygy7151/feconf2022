import { useEffect, useRef, useState } from "react";
import { SceneItem } from "scenejs";
import * as THREE from "three";
import { EFFECT_COLOR } from "../consts";
import { getAtmosphereMesh, getHaloMesh, getSunriseMesh } from "./Sunrise";
import { ThreeCanvas, ThreeCanvasObject } from "./ThreeCanvas";


export function getCloudMesh() {
    const cloudGeometry = new THREE.SphereGeometry(0.601, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("texture/2k_earth_clouds.jpeg"),
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const cloudMesh = new THREE.Mesh(
        cloudGeometry,
        cloudMaterial,
    );
    cloudMesh.rotateX(-0.4);
    cloudMesh.rotateY(2.4);

    return cloudMesh;
}
export function getEarthMesh(onReady: () => void) {
    const earthGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("texture/earth.jpeg", onReady),
        specularMap: new THREE.TextureLoader().load("texture/2k_earth_specular_map.png"),
        // normalMap: new THREE.TextureLoader().load("texture/2k_earth_normal_map.png"),
        // normalScale: new THREE.Vector2(-2, -2),
        // transparent: true,
        // depthWrite: true,
    });
    const earthMesh = new THREE.Mesh(
        earthGeometry,
        earthMaterial,
    );
    earthMesh.rotateX(-0.4);
    earthMesh.rotateY(2.4);

    return earthMesh;
}

export interface EarthProps {
    fadeIn: boolean;
}
export const Earth = (props: EarthProps) => {
    const atmosphereRef = useRef<THREE.Mesh>();
    const haloRef = useRef<THREE.Mesh>();
    const sunriseRef = useRef<THREE.Mesh>();
    const earthRef = useRef<THREE.Mesh>();
    const cloudRef = useRef<THREE.Mesh>();
    const effectLightRef = useRef<THREE.PointLight>();
    const whiteLightRef = useRef<THREE.PointLight>();

    const [isReady, setReady] = useState(false);
    const threeCanvasRef = useRef<ThreeCanvasObject>(null);

    useEffect(() => {
        const scene = threeCanvasRef.current!.sceneRef.current!;
        const haloMesh = getHaloMesh();
        const sunriseMesh = getSunriseMesh();
        const atmosphereMesh = getAtmosphereMesh();
        const cloudMesh = getCloudMesh();
        const earthMesh = getEarthMesh(() => {
            setReady(true);
        });

        const whiteLight = new THREE.PointLight(0xffffff, 3, 5);
        const effectLight = new THREE.PointLight(EFFECT_COLOR, 3, 5);
        const ambientLight = new THREE.AmbientLight(EFFECT_COLOR, 0.4);
        // const helper = new THREE.PointLightHelper(effectLight);

        atmosphereRef.current = atmosphereMesh;
        haloRef.current = haloMesh;
        sunriseRef.current = sunriseMesh;
        earthRef.current = earthMesh;
        cloudRef.current = cloudMesh;
        cloudRef.current = cloudMesh;
        effectLightRef.current = effectLight;
        whiteLightRef.current = whiteLight;

        scene.add(ambientLight);
        scene.add(earthMesh);
        scene.add(cloudMesh);
        scene.add(haloMesh);
        scene.add(sunriseMesh);
        scene.add(atmosphereMesh);
        scene.add(effectLight);
        scene.add(whiteLight);
        // scene.add(helper);
    }, []);
    const [earthScene] = useState(() => {
        const earthItem = new SceneItem({
            0: { t: 0 },
            0.7: {},
            1: { deg: -170, atmosphereScale: 0.5, haloScale: 0, },
            1.6: { t: 100, sunriseScale: 0 },
            1.8: { atmosphereScale: 1.07, },
            2.2: { deg: -255, sunriseScale: 1, haloScale: 1 },
        }, {
            easing: "ease-out",
        }).on("animate", e => {
            const earthMesh = earthRef.current!;
            const cloudMesh = cloudRef.current!;
            const atmosphereMesh = atmosphereRef.current!;
            const haloMesh = haloRef.current!;
            const sunriseMesh = sunriseRef.current!;
            const effectLight = effectLightRef.current!;
            const whiteLight = whiteLightRef.current!;

            if (!earthMesh) {
                return;
            }
            const tick = e.frame.get("t");
            const rad = e.frame.get("deg") * Math.PI / 180;
            const y = -4.7 + tick * 0.02; // -2.7
            const z = 2;
            const globeScale = 6 - 2 * tick / 100;

            // (earthMesh.material as any).opacity = 1;
            // (cloudMesh.material as any).opacity = 1;
            // (atmosphereMesh.material as any).opacity = 1;

            cloudMesh.position.set(0, y, z);
            earthMesh.position.set(0, y, z);
            atmosphereMesh.position.set(0, y, z + 0.1);

            const atmosphereScale = globeScale * e.frame.get("atmosphereScale");

            cloudMesh.scale.set(globeScale, globeScale, globeScale);
            earthMesh.scale.set(globeScale, globeScale, globeScale);
            atmosphereMesh.scale.set(atmosphereScale, atmosphereScale, atmosphereScale);


            // light
            const lightZ = 3 * Math.cos(rad);
            const lightY = 3 * Math.sin(rad);


            effectLight?.position.set(0, y + lightY, z + lightZ);
            whiteLight?.position.set(0, y + lightY, z + lightZ);

            const sunriseScale = e.frame.get("sunriseScale");
            const haloScale = e.frame.get("haloScale");

            sunriseMesh.scale.set(sunriseScale, 1, 1);
            haloMesh.scale.set(haloScale * 1.5, haloScale, haloScale);
        });


        return earthItem;
    });
    useEffect(() => {
        if (props.fadeIn && isReady) {
            earthScene.setTime(0);
            earthScene.play();

            return () => {
                earthScene.pause();
            };
        }
    }, [isReady, props.fadeIn]);
    return <ThreeCanvas ref={threeCanvasRef} render={isReady && props.fadeIn} onRender={() => {
        if (!earthRef.current) {
            return;
        }
        earthRef.current!.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
        cloudRef.current!.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
    }}></ThreeCanvas>;
};