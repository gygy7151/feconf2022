import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import './App.css';
import { WarpLine } from './three/WarpLine';
import { Earth } from './three/Earth';


function App() {
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


 
  const [testLight] = useState(() => new THREE.PointLight());
  return (
    <div className="App">
      <section className="heroSection">
        <WarpLine />
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
              Earth: <input type="file" id="earthFile"></input><br />
              Cloud: <input type="file" id="cloudFile"></input><br />
            </div>
          </div>
        </div>
      </section>
      <section className="other" id="soon">
        <div className="sticky">
          <div className="container">
            <Earth fadeIn={fadeIn} />
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
