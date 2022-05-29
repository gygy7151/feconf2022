import React, { useEffect } from 'react';
import Scene, { SceneItem } from 'scenejs';
import * as THREE from 'three';
import { Matrix4 } from 'three';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import './App.css';

const vertexShader = `
varying vec3 vNormal;


void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
varying vec3 vNormal;
uniform vec3 uColor;

void main() {
  float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 15.0); 
	gl_FragColor = vec4(uColor, 1.0 ) * intensity;
}
`;
const haloFragmentShader = `
varying vec3 vNormal;
uniform vec3 uColor;

void main() {
	gl_FragColor = vec4(uColor, 1.0 ) * (1.0 - dot(vNormal.xy, vNormal.xy));
}
`;
const sunriseVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const sunriseFragmentShader = `
varying vec2 vUv;
uniform vec3 uColor;

void main() {

  float x = 1.0 - 2.0 * abs(vUv.x - 0.5);
  float scale = x * 2.0;
	gl_FragColor = vec4( uColor, 1.0 ) * scale;
}
`;
function App() {

  useEffect(() => {
    // global variables
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    const canvas = document.querySelector<HTMLCanvasElement>('.webgl')!;

    // scene setup
    scene = new THREE.Scene();

    // camera setup
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    const perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10000);


    perspectiveCamera.position.z = 2;
    camera.position.z = 10;
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


    // https://www.solarsystemscope.com/textures/
    // earth geometry
    const earthGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      // roughness: 1,
      // metalness: 0,
      // shininess: 0.1,
      map: new THREE.TextureLoader().load('texture/world.topo.bathy.200404.3x5400x2700.jpg'),
      // map: new THREE.TextureLoader().load('texture/earth360.png'),

      specularMap: new THREE.TextureLoader().load('texture/2k_earth_specular_map.png'),
      specular: new THREE.Color('black'),
      // bumpMap: new THREE.TextureLoader().load('texture/8081_earthbump2k.jpg'),
      normalMap: new THREE.TextureLoader().load("texture/2k_earth_normal_map.png"),
      normalScale: new THREE.Vector2(-2, -2),
    });
    new THREE.TextureLoader()
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    // scene.add(earthMesh);

    const cloudGeometry = new THREE.SphereGeometry(0.601, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
      depthWrite: false,
      // map: new THREE.TextureLoader().load("texture/earthCloud.png"),
      // map: makeEarthCloudTexture(),
      map: new THREE.TextureLoader().load("texture/2k_earth_clouds.jpeg"),
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    // scene.add(cloudMesh);


    earthMesh.rotateX(-0.4);
    cloudMesh.rotateX(-0.4);
    earthMesh.rotateY(2.4);
    cloudMesh.rotateY(2.4);
    // galaxy geometry
    const galaxyGeometry = new THREE.BoxGeometry(2, 1, 1);
    const galaxyMaterial = new THREE.MeshBasicMaterial({
      // map: new THREE.TextureLoader().load('texture/2k_stars_milky_way.jpeg'),
      map: new THREE.TextureLoader().load('texture/2k_stars.jpeg'),
      side: THREE.BackSide
    });
    const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
    galaxyMesh.position.set(0, 0, -100);
    galaxyMesh.scale.set(aspect * 2, aspect * 2, aspect * 2);
    scene.add(galaxyMesh);


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
      const lineRadius = 20 + (Math.random() * 20);
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
    const lightColor = new THREE.Color("#31ADFF");
    const atmosphereGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uColor: { value: lightColor },
      }
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial,
    );

    // scene.add(atmosphereMesh);
    const haloGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const haloMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: haloFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uColor: { value: lightColor },
      }
    });
    const haloMesh = new THREE.Mesh(
      haloGeometry,
      haloMaterial,
    );
    haloMesh.position.set(0, -0.43, -0.1);
    haloMesh.scale.set(1.5, 1, 1);

    // scene.add(haloMesh);

    const sunriseGeometry = new THREE.BoxGeometry(2.5, 0.01, 0.01, 10, 10);
    const sunriseMaterial = new THREE.ShaderMaterial({
      vertexShader: sunriseVertexShader,
      fragmentShader: sunriseFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uColor: { value: lightColor },
      }
    });
    const sunriseMesh = new THREE.Mesh(
      sunriseGeometry,
      sunriseMaterial,
    );
    sunriseMesh.position.set(0, -0.242, 0);
    // scene.add(sunriseMesh);

    // ambient light
    const ambientlight = new THREE.AmbientLight(lightColor, 0.5);
    ambientlight.position.set(0, -0.5, -0.5);
    // scene.add(ambientlight);

    // const ambientlightProbe = new THREE.AmbientLightProbe(0xffffff, 0.5);
    // scene.add(ambientlightProbe);

    // point light
    const pointLight = new THREE.PointLight(lightColor, 3, 5);
    const pointLight2 = new THREE.PointLight(0xffffff, 3, 5);

    scene.add(pointLight);
    scene.add(pointLight2);

    // point light helper
    // const Helper = new THREE.PointLightHelper(pointLight);
    // scene.add(Helper);

    lineObject.matrixAutoUpdate = false;

    lineObject.matrix.makePerspective(-1, 1, 1, -1, 0.5, -100);

    // let z = 1.7;
    const endPoint = 1.3;
    // y = log 2 z

    const earthItem = new SceneItem({
      0: { t: 0 },
      8.5: { deg: -170, atmosphereScale: 0.9, haloScale: 0, },
      9.1: { sunriseScale: 0, sunrisePosition: -0.01 },
      9.7: { atmosphereScale: 1.07, deg: -260, sunriseScale: 1, sunrisePosition: 0, haloScale: 1 },
      10: { t: 320 },
      11: {},
    }, {
      easing: "ease-out",
    }).on("animate", e => {
      const tick = e.frame.get("t");

      const rad = e.frame.get("deg") * Math.PI / 180;

      let z = -30 + tick * 0.1;

      if (z > endPoint) {
        z = endPoint;
      }
      const reverse = (from: number[], to: number[], c: number, point: number) => {
        // y =  a / (x - b) + c
        // from[1] = a / (from[0] - b) + c
        // (from[1] - c)  * (from[0] - b) = a
        // (from[1] - c) * (from[0] - b) = (to[1] - c) * (to[0] - b)
        // (from[1] - c) / (to[1] - c) * (from[0] - b) = to[0] - b
        // (1 - (from[1] - c) / (to[1] - c)) * b = to[0] - (from[1] - c) / (to[1] - c) * from[0];

        const b = (to[0] - (from[1] - c) / (to[1] - c) * from[0]) / (1 - (from[1] - c) / (to[1] - c));
        const a = (from[1] - c) * (from[0] - b);

        return a / (point - b) + c;
      };

      // y = Math.log10(endPoint + 1 - z) * 3 - 2.65;
      const y = reverse([-30, 0], [endPoint, -2.65], 0.02, z);
      const globeScale = reverse([-30, 0.01], [endPoint, 4], -0.1, z); // linear([-30, 0.01], [endPoint, 4], z)

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

      pointLight.position.set(0, y + lightY, z + lightZ);
      pointLight2.position.set(0, y + lightY, z + lightZ);

      const sunriseScale = e.frame.get("sunriseScale");
      const sunrisePosition = e.frame.get("sunrisePosition");
      const haloScale = e.frame.get("haloScale");

      sunriseMesh.position.set(0, -0.242 + sunrisePosition, 0);
      sunriseMesh.scale.set(sunriseScale, sunriseScale, 1);
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

    earthScene.setTime(earthScene.getDuration());
    const render = () => {

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


      earthMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
      cloudMesh.rotateOnAxis(new THREE.Vector3(1, 2, -1), 0.0003);
      renderer.render(scene, camera);
      // composer.render();
    }
    let raqId = 0;
    const animate = () => {
      raqId = requestAnimationFrame(animate);
      render();
    };
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const ratio = Math.min(2, scrollTop / window.innerHeight);
      const duration = earthScene.getDuration();
      const time = ratio / 2 * duration;

      earthScene.setTime(time);
    }
    const onResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      // camera.aspect = aspect;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    animate();

    const sections: HTMLElement[] = [].slice.call(document.querySelectorAll(".other"));

    sections.forEach(section => {
      section.querySelector(".container")!.addEventListener("transitionend", () => {
        if (section.classList.contains("fadeOut")) {
          section.classList.remove("fadeOut");
        }
      });
    });
    let intersectionRatio = [0, 0, 0, 0];
    let intersections = [false, false, false, false];
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        intersections[sections.indexOf(target as HTMLElement)]
          = entry.intersectionRatio >= 0.99;

          intersectionRatio[sections.indexOf(target as HTMLElement)]
          = entry.intersectionRatio;

        if (entry.intersectionRatio < 0.99) {
          target.classList.remove("fadeIn");
          target.classList.add("fadeOut");
        }
        
      });

      console.log(intersections, intersectionRatio);
      const index = intersections.lastIndexOf(true);

      sections.forEach((section, i) => {
        if (i === index) {
          section.classList.remove("fadeOut");
          section.classList.add("fadeIn");          
        } else {
          section.classList.remove("fadeIn");
          section.classList.add("fadeOut");
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

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raqId);
      scene.clear();
      renderer.clear();
    };
  }, []);
  return (
    <div className="App">
      <section className="heroSection">
        <div className="hero">
          <canvas className="webgl"></canvas>
          <div className="soon">
            {/* <h3>Coming Soon</h3>
            <p className="description">22nd FEConf Frontend Developer Conference</p> */}
          </div>
        </div>
      </section>
      <section className="other">
        <div className="container">
          <h2>WHY0</h2>
        </div>
      </section>
      <section className="other">
        <div className="container">
          <h2>WHY1</h2>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p><p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
          <p>aasasas</p>
        </div>
      </section>
      <section className="other">
        <div className="container">
          <h2>WHY2</h2>
        </div>
      </section>
      <section className="other">
        <div className="container">
          <h2>WHY3</h2>
        </div>
      </section>
    </div>
  );
}

export default App;
