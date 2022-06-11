import React, { Suspense, useEffect, useRef, useState } from 'react';
import Scene, { SceneItem } from 'scenejs';
import * as THREE from 'three';
import { Matrix4, PointLightHelper } from 'three';

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

              if (sections[5] === target) {
                setFadeIn(true);
              }
            });
          });
        } else if (ratio <= 0.4) {
          if (sections[5] === target) {
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
  const lightHelperRef = useRef<THREE.PointLightHelper>(null);
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
      2.2: { deg: -240, sunriseScale: 1, haloScale: 1 },
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

      // (earthMesh.material as any).opacity = 1;
      // (cloudMesh.material as any).opacity = 1;
      // (atmosphereMesh.material as any).opacity = 1;

      cloudMesh.position.set(0, y, z);
      earthMesh.position.set(0, y, z);
      atmosphereMesh.position.set(0, y, z - 0.1);

      const atmosphereScale = globeScale * e.frame.get("atmosphereScale");

      cloudMesh.scale.set(globeScale, globeScale, globeScale);
      earthMesh.scale.set(globeScale, globeScale, globeScale);
      atmosphereMesh.scale.set(atmosphereScale, atmosphereScale, atmosphereScale);


      // light
      const lightZ = 5 * Math.cos(rad);
      const lightY = 5 * Math.sin(rad);

      lightHelperRef.current!.light = whiteLight;
      lightHelperRef.current!.matrix = whiteLight.matrixWorld;

      effectLight?.position.set(0, y + lightY, z + lightZ);
      whiteLight?.position.set(0, y + lightY, z + lightZ);

      const sunriseScale = e.frame.get("sunriseScale");
      const haloScale = e.frame.get("haloScale");

      sunriseMesh.scale.set(sunriseScale, 1, 1);
      haloMesh.scale.set(haloScale * 1.5, haloScale, haloScale);
    });

    const earthScene = new Scene({
      earth: earthItem,
    });

    return earthScene;
  });
  useEffect(() => {
    earthScene.setSelector();
  }, []);
  useEffect(() => {
    if (fadeIn && isReady) {
      earthScene.setTime(0);
      earthScene.play();

      let rafId = requestAnimationFrame(function move() {
        earthRef.current!.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
        cloudRef.current!.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);

        rafId = requestAnimationFrame(move);
      });
      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  }, [fadeIn, isReady]);
  const [testLight] = useState(() => new THREE.PointLight());
  return (
    <div className="App">
      <section className="heroSection">
        <Canvas orthographic={true}>
          <Default />
          <Galaxy />
          <WarpLine />
        </Canvas>
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0px",
          left: "0px",
          background: "radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
        }}></div>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <div className="main">
              <p className="subTitle">Explore the forefront of FE dev</p>
              <h1>FECONF. 22</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="other" id="introduction">
        <div className="sticky">
          <div className="container">
            <div className="main">
              <div className="description">
                국내 최대 규모 프론트엔드 개발 컨퍼런스 FEConf<br />
                엔지니어들의 다양한 도전과 경험을 공유합니다.<br />
                새로운 기술을 익히고 함께 성장해요.
              </div>
              </div>
            </div>
            </div>
      </section>
      <section className="other" id="speaker">
        <div className="sticky">
          <div className="container">
            <div className="main">
              <h2>FEConf 22를 함께 빛낼<br />스피커를 모집해요!</h2>
              <p className="description">당신의 멋진 스토리를 공유하고, 함께 빛내요.</p>
              <button className="apply">스피커 신청하기</button>
            </div>
          </div>
        </div>
      </section>
      <section className="other" id="sponser">
        <div className="sticky">
          <div className="container">
            <div className="main">
              <h2>컨퍼런스를 함께 만들어갈<br />후원사를 모집해요.</h2>
              <p className="description">후원을 통해 함께 프론트엔드 개발 문화를 만들고,<br />기업 홍보 및 채용 활동을 계획해보세요!</p>
              <button className="ask">후원 모집하기</button>
            </div>
          </div>
        </div>
      </section>
      <section className="other">
        <div className="sticky">
          <div className="container">
            <div className="main">
              Earth: <input type="file" id="earthFile"></input><br/>
              Cloud: <input type="file" id="cloudFile"></input><br/>
            </div>
          </div>
        </div>
      </section>
      <section className="other" id="soon">
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
                <pointLightHelper ref={lightHelperRef} args={[testLight]} />
                <pointLight ref={effectLightRef} color={EFFECT_COLOR} intensity={5} distance={4} />
                <pointLight ref={whiteLightRef} color={0xffffff} intensity={5} distance={4} />
              </Canvas>
            </Suspense>
            <div className="main">
              <h1>10월에 찾아옵니다.</h1>
              <p className="description">2022 FEConf -&gt; Frontend Developer Conference</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
