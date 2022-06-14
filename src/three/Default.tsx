import * as React from "react";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export function Default() {
    const threeObject = useThree();
    useEffect(() => {
        function onResize() {
            console.log("RESIZE");
            const gl = threeObject.gl;
            const orthographicCamera = threeObject.camera as THREE.OrthographicCamera;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspect = width / height;

            gl.setSize(width, height);
            gl.setPixelRatio(window.devicePixelRatio || 1);
            gl.autoClear = true;
            gl.setClearColor(0x000000, 0);

            (orthographicCamera as any).manual = true;
            orthographicCamera.left = -aspect;
            orthographicCamera.right = aspect;
            orthographicCamera.top = 1;
            orthographicCamera.bottom = -1;
            orthographicCamera.near = 0.1;
            orthographicCamera.far = 10000;
            orthographicCamera.updateProjectionMatrix();
        }

        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("reisze", onResize);
        }
    }, [threeObject]);

    return <mesh></mesh>;
}