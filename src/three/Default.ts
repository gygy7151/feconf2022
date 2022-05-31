import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Default() {
    const threeObject = useThree();
    const gl = threeObject.gl;
    const orthographicCamera = threeObject.camera as THREE.OrthographicCamera;
    // const size = threeObject.size;
    const aspect = window.innerWidth / window.innerHeight;
    
    gl.setSize(window.innerWidth, window.innerHeight);
    gl.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
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

    return null;
}