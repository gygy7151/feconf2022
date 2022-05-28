import React, { useEffect } from 'react';
import Scene, { SceneItem } from 'scenejs';
import * as THREE from 'three';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import './App.css';

const vertexShader = `
varying vec2 vPos;
varying vec3 vVertexWorldPosition;
varying vec3 vNormal;


void main() {
  vNormal = normalize(normalMatrix * normal);
  vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPos = gl_Position.xy / gl_Position.w;
}
`;
const fragmentShader = `
#define M_PI 3.1415926535897932384626433832795
varying vec2 vPos;
// uniform float aspect;
// uniform float minX;
// uniform float maxX;
// uniform float minY;
// uniform float maxY;


varying vec3 vNormal;
varying vec3 vVertexWorldPosition;

void main() {
  float intensity = pow(0.65 - dot(vNormal, vec3( 0.0, 0.0, 1.0 ) ),  2.9); 
	gl_FragColor = vec4( 0.3, 0.8, 1.0, 1.0 ) * intensity;
}
`;

function App() {
  useEffect(() => {
    // global variables
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    const canvas = document.querySelector<HTMLCanvasElement>('.webgl')!;

    // scene setup
    scene = new THREE.Scene();

    // camera setup
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0, 10);


    camera.position.z = 2;
    scene.add(camera);

    // renderer setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });



    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 1.0);


    // earth geometry
    const earthGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      // roughness: 1,
      // metalness: 0,
      // shininess: 10,
      map: new THREE.TextureLoader().load('texture/2k_earth_daymap.jpeg'),
      specularMap: new THREE.TextureLoader().load('texture/2k_earth_specular_map.tif'),
      // bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpg'),
      // bumpScale: 0.3
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    
    scene.add(earthMesh);

    const cloudGeometry = new THREE.SphereGeometry(0.601, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
      depthWrite: false,
      map: new THREE.TextureLoader().load('texture/2k_earth_clouds.jpeg'),
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    // galaxy geometry
    const starGeometry = new THREE.SphereGeometry(80, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('texture/galaxy.png'),
      side: THREE.BackSide
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);


    // https://aberlechiropractic.com/3d/spacewarp.html
    const lineCount = 3000;
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * lineCount), 3));
    lineGeometry.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2 * lineCount), 1));
    const linePosition = lineGeometry.getAttribute("position");
    const lineVelocity = lineGeometry.getAttribute("velocity");
    let points = linePosition.array as number[];
    let velocities = lineVelocity.array as number[];

    for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
      const rad = Math.random() * Math.PI * 2;
      const lineRadius = 4 + (Math.random() * 10);
      const lineX = lineRadius * Math.cos(rad);
      const lineY = lineRadius * Math.sin(rad);
      const lineZ = Math.random() * 500 - 100;
      //line start to End
      points[6 * lineIndex + 3] = points[6 * lineIndex] = lineX;
      points[6 * lineIndex + 4] = points[6 * lineIndex + 1] = lineY;
      points[6 * lineIndex + 5] = points[6 * lineIndex + 2] = lineZ;
      velocities[2 * lineIndex] = velocities[2 * lineIndex + 1] = 0;
    }
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lineObject = new THREE.LineSegments(lineGeometry, lineMaterial);

    scene.add(lineObject);

    // atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        aspect: { value: window.innerWidth / window.innerHeight },
        minX: { value: -1 },
        maxX: { value: 1 },
        minY: { value: -1 },
        maxY: { value: 1 },
        minZ: { value: -1 },
        maxZ: { value: 1 },
      }
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial,
    );

    scene.add(atmosphereMesh);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 100);
    scene.add( directionalLight );

    // ambient light
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    ambientlight.position.set(0, -0.5, -0.5);
    scene.add(ambientlight);

    // const ambientlightProbe = new THREE.AmbientLightProbe(0xffffff, 0.5);
    // scene.add(ambientlightProbe);

    // point light
    const pointLight = new THREE.PointLight(0xaaaac2, 4, 10);

    scene.add(pointLight);

    // point light helper
    const Helper = new THREE.PointLightHelper(pointLight);
    scene.add(Helper);


    let y = -0.7;
    let z = 1.7;
    const endPoint = 1.3;
    // y = log 2 z

    const earthItem = new SceneItem({
      0: { t: 0 },
      9.5: { deg: -200 },
      10.5: { scale: 0.8 },
      10.7: { scale: 1.05, deg: -220 },
      11: { t: 320 },
    }, {
      easing: "ease-out",
    }).on("animate", e => {
      const tick = e.frame.get("t");
      const scale = e.frame.get("scale");
      const rad = e.frame.get("deg") * Math.PI / 180;

      atmosphereMesh.scale.set(scale, scale, scale);
      z = -30 + tick * 0.1;

      if (z > endPoint) {
        z = endPoint;
      }
      y = Math.log10(endPoint + 1 - z) - 0.65;

      cloudMesh.position.y = y;
      cloudMesh.position.z = z;
      earthMesh.position.y = y;
      earthMesh.position.z = z;

      atmosphereMesh.position.y = y;
      atmosphereMesh.position.z = z - 0.01;

      const lightZ = 2 * Math.cos(rad);
      const lightY = 2 * Math.sin(rad);

      directionalLight.position.set(0, y, z - 2);
      pointLight.position.set(0, y + lightY, z + lightZ);
    });

    const soonText = "Coming Soon";
    const descriptionText = "22nd FEConf Frontend Developer Conference";
    function typing(item: SceneItem, text: string, startTime: number, endTime: number) {

      const length = text.length;

      for (let i = 0; i <= length; ++i) {
        item.set(startTime + (endTime - startTime) * i / length, "html", text.substring(0, i));
      }
      return item;
    }

    const textScene = new Scene({
      ".soon": {
        8.5: {
          transform: "translate(-50%, -50%) scale(1.2) translateY(-100px)",
        },
        10.5: {
          transform: "scale(1) translateY(0px)",
        },
      },
      ".soon h3": {},
      ".soon .description": {},
    }, {
      easing: "ease-out",
      selector: true,
    });
    typing(textScene.getItem(".soon h3"), soonText, 9, 10);
    typing(textScene.getItem(".soon .description"), descriptionText, 9.5, 10.5);

    const earthScene = new Scene({
      earth: earthItem,
      text: textScene,
    });
    window.addEventListener("wheel", e => {
      earthScene.setTime(earthScene.getTime() + e.deltaY / 1000);
    });


    earthScene.setTime(earthScene.getDuration());
    const render = () => {
      const matrix = new THREE.Matrix4();
      const matrix2 = new THREE.Matrix4();


      for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
        velocities[2 * lineIndex] += 0.007;
        velocities[2 * lineIndex + 1] += 0.0071;

        // z
        points[6 * lineIndex + 2] += velocities[2 * lineIndex];
        points[6 * lineIndex + 5] += velocities[2 * lineIndex + 1];

        if (points[6 * lineIndex + 5] > 200) {
          const z = Math.random() * 200 - 100;

          points[6 * lineIndex + 2] = z;
          points[6 * lineIndex + 5] = z;
          velocities[2 * lineIndex] = 0;
          velocities[2 * lineIndex + 1] = 0;
        }
      }
      linePosition.needsUpdate = true;

      earthMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0001);
      cloudMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0001);

      camera.updateProjectionMatrix();
      atmosphereGeometry.computeVertexNormals();
      matrix2.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      matrix.multiplyMatrices(matrix2, atmosphereMesh.matrix);

      const elements = matrix.elements;
      const rangeX = [Infinity, -Infinity];
      const rangeY = [Infinity, -Infinity];
      const rangeZ = [Infinity, -Infinity];
      const count = 30;
      const r = 0.6;

      for (let i = 0; i < count; ++i) {
        const rad1 = 2 * Math.PI / count * i;
        // const x = r * Math.cos(rad1);
        const y = r * Math.sin(rad1);
        const zr = Math.sqrt(r * r - y * y);

        for (let j = 0; j < count; ++j) {
          const rad2 = 2 * Math.PI / count * j;

          const x = zr * Math.cos(rad2);
          const z = zr * Math.sin(rad2);

          const vec4 = [
            x,
            y,
            z,
            1,
          ];


          const dest = [
            elements[0] * vec4[0] + elements[4] * vec4[1] + elements[8] * vec4[2] + elements[12] * vec4[3],
            elements[1] * vec4[0] + elements[5] * vec4[1] + elements[9] * vec4[2] + elements[13] * vec4[3],
            elements[2] * vec4[0] + elements[6] * vec4[1] + elements[10] * vec4[2] + elements[14] * vec4[3],
            elements[3] * vec4[0] + elements[7] * vec4[1] + elements[11] * vec4[2] + elements[15] * vec4[3],
          ];

          if (Math.abs(dest[3]) < 0.1) {
            continue;
          }
          dest[0] = dest[0] / dest[3];
          dest[1] = dest[1] / dest[3];
          dest[2] = dest[2] / dest[3];

          if (isNaN(dest[0])) {
            continue;
          }
          rangeX[0] = Math.min(dest[0], rangeX[0]);
          rangeX[1] = Math.max(dest[0], rangeX[1]);

          rangeY[0] = Math.min(dest[1], rangeY[0]);
          rangeY[1] = Math.max(dest[1], rangeY[1]);

          rangeZ[0] = Math.min(dest[2], rangeZ[0]);
          rangeZ[1] = Math.max(dest[2], rangeZ[1]);
        }
      }
      atmosphereMaterial.uniforms.minX.value = rangeX[0];
      atmosphereMaterial.uniforms.maxX.value = rangeX[1];
      atmosphereMaterial.uniforms.minY.value = rangeY[0];
      atmosphereMaterial.uniforms.maxY.value = rangeY[1];
      atmosphereMaterial.uniforms.minZ.value = rangeZ[0];
      atmosphereMaterial.uniforms.maxZ.value = rangeZ[1];
      renderer.render(scene, camera);
      // composer.render();
    }
    let raqId = 0;
    const animate = () => {
      raqId = requestAnimationFrame(animate);
      render();
    };
    window.addEventListener('resize', () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      // camera.left = -aspect;
      // camera.right = aspect;
      camera.updateProjectionMatrix();
      atmosphereMaterial.uniforms.aspect.value = aspect;
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }, false);
    // rendering


    animate();


    return () => {
      cancelAnimationFrame(raqId);
      scene.clear();
      renderer.clear();
    };
  }, []);
  return (
    <div className="App">
      <canvas className="webgl"></canvas>
      <div className="soon">
        <h3>Coming Soon</h3>
        <p className="description">22nd FEConf Frontend Developer Conference</p>
      </div>
    </div>
  );
}

export default App;
