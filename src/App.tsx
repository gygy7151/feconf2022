import React, { Suspense, useEffect, useRef, useState } from 'react';
import Scene, { SceneItem } from 'scenejs';
import * as THREE from 'three';
import { Matrix4 } from 'three';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { Canvas, useFrame } from "@react-three/fiber";

import './App.css';
import { WarpLine } from './three/WarpLine';
import { Galaxy } from './three/Galaxy';
import { Default } from './three/Default';
import { Cloud, Earth } from './three/Earth';
import { EFFECT_COLOR } from './consts';
import { Atmosphere, Halo, Sunrise } from './three/Sunrise';



function Box(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function App() {

    // earthMesh.rotateX(-0.4);
    // cloudMesh.rotateX(-0.4);
    // earthMesh.rotateY(2.4);
    // cloudMesh.rotateY(2.4);

  //   // galaxy geometry
  //   const galaxyGeometry = new THREE.BoxGeometry(2, 1, 1);
  //   const galaxyMaterial = new THREE.MeshBasicMaterial({
  //     // map: new THREE.TextureLoader().load('texture/2k_stars_milky_way.jpeg'),
  //     map: new THREE.TextureLoader().load('texture/2k_stars.jpeg'),
  //     side: THREE.BackSide
  //   });
  //   const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
  //   galaxyMesh.position.set(0, 0, -100);
  //   galaxyMesh.scale.set(aspect * 2, aspect * 2, aspect * 2);
  //   scene.add(galaxyMesh);


  //   // https://aberlechiropractic.com/3d/spacewarp.html

  //   const lineGeometry = new THREE.BufferGeometry();
  //   lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * lineCount), 3));
  //   lineGeometry.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2 * lineCount), 1));
  //   const linePosition = lineGeometry.getAttribute("position");
  //   const lineVelocity = lineGeometry.getAttribute("velocity");
  //   let points = linePosition.array as number[];
  //   let velocities = lineVelocity.array as number[];

  //   for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
  //     const rad = Math.random() * Math.PI * 2;
  //     const lineRadius = 20 + (Math.random() * 20);
  //     const lineX = lineRadius * Math.cos(rad);
  //     const lineY = lineRadius * Math.sin(rad);
  //     const lineZ = Math.random() * 500 - 100;
  //     //line start to End
  //     points[6 * lineIndex + 3] = points[6 * lineIndex] = lineX;
  //     points[6 * lineIndex + 4] = points[6 * lineIndex + 1] = lineY;
  //     points[6 * lineIndex + 5] = points[6 * lineIndex + 2] = lineZ;
  //     velocities[2 * lineIndex] = velocities[2 * lineIndex + 1] = 0;
  //   }
  //   const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  //   const lineObject = new THREE.LineSegments(lineGeometry, lineMaterial);

  //   scene.add(lineObject);

  //   // scene.add(atmosphereMesh);
  //   const haloGeometry = new THREE.SphereGeometry(0.5, 64, 64);
  //   const haloMaterial = new THREE.ShaderMaterial({
  //     vertexShader,
  //     fragmentShader: haloFragmentShader,
  //     blending: THREE.AdditiveBlending,
  //     side: THREE.BackSide,
  //     transparent: true,
  //     depthWrite: true,
  //     uniforms: {
  //       uColor: { value: lightColor },
  //     }
  //   });
  //   const haloMesh = new THREE.Mesh(
  //     haloGeometry,
  //     haloMaterial,
  //   );
  //   haloMesh.position.set(0, -0.43, -0.1);
  //   haloMesh.scale.set(1.5, 1, 1);

  //   // scene.add(haloMesh);

  //   const sunriseGeometry = new THREE.BoxGeometry(2.5, 0.01, 0.01, 10, 10);
  //   const sunriseMaterial = new THREE.ShaderMaterial({
  //     vertexShader: sunriseVertexShader,
  //     fragmentShader: sunriseFragmentShader,
  //     blending: THREE.AdditiveBlending,
  //     side: THREE.BackSide,
  //     transparent: true,
  //     depthWrite: true,
  //     uniforms: {
  //       uColor: { value: lightColor },
  //     }
  //   });
  //   const sunriseMesh = new THREE.Mesh(
  //     sunriseGeometry,
  //     sunriseMaterial,
  //   );
  //   sunriseMesh.position.set(0, -0.242, 0);
  //   // scene.add(sunriseMesh);

  //   // ambient light
  //   const ambientlight = new THREE.AmbientLight(lightColor, 0.5);
  //   ambientlight.position.set(0, -0.5, -0.5);
  //   // scene.add(ambientlight);

  //   // const ambientlightProbe = new THREE.AmbientLightProbe(0xffffff, 0.5);
  //   // scene.add(ambientlightProbe);

  //   // point light
  //   const pointLight = new THREE.PointLight(lightColor, 3, 5);
  //   const pointLight2 = new THREE.PointLight(0xffffff, 3, 5);

  //   scene.add(pointLight);
  //   scene.add(pointLight2);

  //   // point light helper
  //   // const Helper = new THREE.PointLightHelper(pointLight);
  //   // scene.add(Helper);

  //   lineObject.matrixAutoUpdate = false;

  //   lineObject.matrix.makePerspective(-1, 1, 1, -1, 0.5, -100);

  //   // let z = 1.7;
  //   const endPoint = 1.3;
  //   // y = log 2 z

  //   const render = () => {

  //     for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
  //       velocities[2 * lineIndex] += 0.007;
  //       velocities[2 * lineIndex + 1] += 0.0071;

  //       // z
  //       points[6 * lineIndex + 2] += velocities[2 * lineIndex];
  //       points[6 * lineIndex + 5] += velocities[2 * lineIndex + 1];

  //       if (points[6 * lineIndex + 5] > 200) {
  //         const z = Math.random() * 200 - 100;

  //         points[6 * lineIndex + 2] = z;
  //         points[6 * lineIndex + 5] = z;
  //         velocities[2 * lineIndex] = 0;
  //         velocities[2 * lineIndex + 1] = 0;
  //       }
  //     }
  //     linePosition.needsUpdate = true;


  //     earthMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
  //     cloudMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
  //     renderer.render(scene, camera);
  //     // composer.render();
  //   }
  // }, []);
  // <canvas className="webgl"></canvas>
  // <div className="soon">
  //   {/* <h3>Coming Soon</h3>
  //   <p className="description">22nd FEConf Frontend Developer Conference</p> */}
  // </div>
  // -aspect, aspect, 1, -1, 0.1, 10000

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const sections: HTMLElement[] = [].slice.call(document.querySelectorAll(".other"));

    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;
        const target = entry.target;

        if (ratio >= 0.6) {
          if (target.classList.contains("fadeOut")) {
            target.classList.remove("fadeOut");
            target.classList.add("fadeZero");
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              target.classList.remove("fadeOut", "fadeZero");
              target.classList.add("fadeIn");

              if (sections[3] === target) {
                setFadeIn(true);
              }
            });
          });
        } else if (ratio <= 0.4) {
          if (sections[3] === target) {
            setFadeIn(false);
          }
          if (target.classList.contains("fadeIn")) {
            target.classList.add("fadeOut");
            target.classList.remove("fadeIn", "fadeZero");
          } else if (!target.classList.contains("fadeOut")) {
            target.classList.add("fadeZero");
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 1.0],
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }, []);


  const atmosphereRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const sunriseRef = useRef<THREE.Mesh>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const effectLightRef = useRef<THREE.PointLight>(null);
  const whiteLightRef = useRef<THREE.PointLight>(null);

  const [isReady, setReady] = useState(false);
  const [earthScene] = useState(() => {
    const earthItem = new SceneItem({
      0: { t: 0 },
      0.7: { atmosphereScale: 0.9 },
      1: { t: 100, deg: -170, haloScale: 0, },
      1.6: { sunriseScale: 0 },
      1.8: { atmosphereScale: 1.07, },
      2.2: { deg: -260, sunriseScale: 1, haloScale: 1 },
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
      const y = -3.7 + tick * 0.01; // -2.7
      const z = 2;
      const globeScale = 4;

      cloudMesh.position.set(0, y, z);
      earthMesh.position.set(0, y, z);
      atmosphereMesh.position.set(0, y, z - 0.1);

      const atmosphereScale = globeScale * e.frame.get("atmosphereScale");

      cloudMesh.scale.set(globeScale, globeScale, globeScale);
      earthMesh.scale.set(globeScale, globeScale, globeScale);
      atmosphereMesh.scale.set(atmosphereScale, atmosphereScale, atmosphereScale);


      // light
      const lightZ = 3 * Math.cos(rad);
      const lightY = 3 * Math.sin(rad);

      effectLight.position.set(0, y + lightY, z + lightZ);
      whiteLight.position.set(0, y + lightY, z + lightZ);

      const sunriseScale = e.frame.get("sunriseScale");
      const haloScale = e.frame.get("haloScale");

      sunriseMesh.scale.set(sunriseScale, 1, 1);
      haloMesh.scale.set(haloScale * 1.5, haloScale, haloScale);
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
    }, {
      easing: "ease-out",
      selector: true,
    });
    typing(textScene.newItem(".soon h3") as SceneItem, soonText, 2, 3);
    typing(textScene.newItem(".soon .description") as SceneItem, descriptionText, 2.4, 4.2);

    const earthScene = new Scene({
      earth: earthItem,
      text: textScene,
    });

    return earthScene;
  });
  useEffect(() => {
    earthScene.setSelector();
    (earthScene.getItem("text") as Scene).setSelector();
  }, []);
  useEffect(() => {
    console.log(fadeIn, isReady);
    if (fadeIn && isReady) {
      earthScene.setTime(0);
      earthScene.play();
    }
  }, [fadeIn, isReady]);
  return (
    <div className="App">
      <section className="heroSection">
        <Canvas orthographic={true}>
          <Default />
          <Galaxy />
          <WarpLine />
        </Canvas>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <h2>WHY0</h2>
          </div>
        </div>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <h2>WHY1</h2>
          </div>
        </div>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <h2>WHY2</h2>
          </div>
        </div>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <Suspense >
              <Canvas orthographic={true}>
                <ambientLight color={EFFECT_COLOR} intensity={0.5} />
                <Default />
                <Earth ref={earthRef} onReady={() => {
                  setReady(true);
                }} />
                <Cloud ref={cloudRef} />
                <Sunrise ref={sunriseRef} />
                <Halo ref={haloRef} />
                <Atmosphere ref={atmosphereRef} />
                <pointLight ref={effectLightRef} color={EFFECT_COLOR} intensity={3} distance={5} />
                <pointLight ref={whiteLightRef} color={0xffffff} intensity={3} distance={5} />
              </Canvas>
            </Suspense>
            <div className="soon">
              <h3></h3>
              <p className="description"></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
