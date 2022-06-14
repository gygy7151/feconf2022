import * as React from "react";
import { forwardRef, MutableRefObject, RefObject, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export interface ThreeCanvasProps {
    render: boolean;
    onRender: () => void;
}
export interface ThreeCanvasObject {
    canvasRef: RefObject<HTMLCanvasElement>;
    rendererRef: MutableRefObject<THREE.WebGLRenderer | undefined>;
    sceneRef: MutableRefObject<THREE.Scene | undefined>;
    cameraRef: MutableRefObject<THREE.OrthographicCamera | undefined>;
}
export const ThreeCanvas = forwardRef<ThreeCanvasObject, ThreeCanvasProps>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.OrthographicCamera>();

    useImperativeHandle(ref, () => {
        return {
            canvasRef,
            rendererRef,
            sceneRef,
            cameraRef,
        };
    });

    useEffect(() => {
        // scene setup
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspect = width / height;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10000);

        camera.position.z = 10;
        scene.add(camera);

        // renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.autoClear = true;
        renderer.setClearColor(0x000000, 1.0);


        rendererRef.current = renderer;
        sceneRef.current = scene;
        cameraRef.current = camera;

        function onResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            aspect = width / height;

            renderer.setSize(width, height);

            camera.left = -aspect;
            camera.right = aspect;
            camera.top = 1;
            camera.bottom = -1;
            camera.near = 0.1;
            camera.far = 10000;
            camera.updateProjectionMatrix();
            props.onRender();
            renderer.render(scene, camera);
        }

        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            renderer.clearColor()
            camera.clear();
            renderer.clear();
            scene.clear();
            window.removeEventListener("reisze", onResize);
        }
    }, []);

    useEffect(() => {
        if (!props.render) {
            return;
        }
        let raqId = requestAnimationFrame(function onRender() {
            props.onRender();
            rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
            raqId = requestAnimationFrame(onRender);
        });

        return () => {
            cancelAnimationFrame(raqId);
        };
    }, [props.render]);

    return <canvas ref={canvasRef}></canvas>;
});