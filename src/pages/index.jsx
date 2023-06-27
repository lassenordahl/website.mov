import { useState, useRef, useEffect, useMemo } from "react";
import Head from "next/head";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Html, PresentationControls, Plane } from "@react-three/drei";
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Info } from "react-feather";
import { motion } from "framer-motion";
import * as THREE from "three";

import { useClient, useTimeline } from "../hooks";
import { ThemeProvider } from "../context/themeContext";
import { LoadingAnimation } from "../components/loadingAnimation";
import { InfoPanel } from "../components/infoPanel";

import styles from "./index.module.scss";
import { Button } from "../components/button";

const videoIds = [
  process.env.NEXT_PUBLIC_VIDEO_ID_ONE,
  process.env.NEXT_PUBLIC_VIDEO_ID_TWO,
  process.env.NEXT_PUBLIC_VIDEO_ID_THREE,
  process.env.NEXT_PUBLIC_VIDEO_ID_FOUR,
];

export const fadeIn = (delay, duration) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration || 0.5, delay: delay },
  },
});

const RotatingObject = ({ path, scale, offset }) => {
  const { scene } = useGLTF(path);
  const mesh = useRef();
  const radiusX = 4; // Define the radius of the oval on the X axis
  const radiusY = 3; // Define the radius of the oval on the Y axis
  const rotationSpeed = 0.003; // Define the rotation speed

  let angle = 0; // Initialize the angle

  // Generate random rotation speeds
  const rotationSpeedX = Math.random() * 0.005;
  const rotationSpeedY = Math.random() * 0.005;
  const rotationSpeedZ = Math.random() * 0.005;

  useFrame(() => {
    if (mesh.current) {
      angle += rotationSpeed; // Increment the angle
      mesh.current.position.x = radiusX * Math.cos(angle + offset);
      mesh.current.position.y = radiusY * Math.sin(angle + offset) - 0.5;

      // Apply the rotations.
      mesh.current.rotation.x += rotationSpeedX;
      mesh.current.rotation.y += rotationSpeedY;
      mesh.current.rotation.z += rotationSpeedZ;
    }
  });

  return <primitive ref={mesh} object={scene} scale={scale} />;
};

const Model = ({ path, zoom, video }) => {
  const { scene } = useGLTF(path);
  const { gl } = useThree();

  // Enable shadows in the WebGLRenderer
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  const getZoom = () => (zoom / 80) * 1.5;

  const enableShadows = (object) => {
    if (object.material) object.material.shadowSide = THREE.DoubleSide;
    object.castShadow = true;
    object.receiveShadow = true;
    object.children.forEach(enableShadows);
  };

  // Enable shadows for the object
  enableShadows(scene);

  return (
    <PresentationControls
      global
      snap
      polar={[-0.1, 0.1]}
      azimuth={[-0.1, 0.1]}
      config={{ mass: 5, tension: 350, friction: 40 }}
    >
      <primitive
        object={scene}
        position={[-1.73, -2.2, getZoom()]}
        scale={[0.8, 0.8, 0.8]}
      >
        <Html wrapperClass={styles.computer} position={[2.1, 3, 0]}>
          <iframe
            style={{ transform: `scale(${1 + 0.35 * (zoom / 80)}` }}
            src={`https://www.youtube.com/embed/${video}?autoplay=1`}
          />
        </Html>
      </primitive>
      <Plane
        args={[4, 12]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.9, 0]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
      <directionalLight
        position={[0, 5, -2]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
    </PresentationControls>
  );
};

const Content = () => {
  const [zoom, setZoom] = useState(0);
  const [infoVisible, setInfoVisible] = useState(false);
  const { client } = useClient();
  const { step, next, prev } = useTimeline(0, videoIds.length - 1, true);
  const [video, setVideo] = useState(videoIds[step]);

  useEffect(() => {
    // If step changes, set the new video ID.
    setVideo(videoIds[step]);
  }, [step]);

  const scene = useMemo(() => (<>
    <ambientLight intensity={0.4} />
    <pointLight position={[-10, 10, 0]} intensity={0.6} />
    {client && (
      <Model path="/assets/monitor.glb" zoom={zoom} video={video} />
    )}
  </>), [client, video, zoom]);

  const rotation = useMemo(() => (<>
    <RotatingObject
      path="/assets/mouse.gltf"
      scale={[0.2, 0.2, 0.2]}
      offset={0}
    />
    <RotatingObject
      path="/assets/xt1.gltf"
      scale={[0.1, 0.1, 0.1]}
      offset={2}
    />
    <RotatingObject
      path="/assets/flashdrive.glb"
      scale={[0.2, 0.2, 0.2]}
      offset={4}
    />
  </>), []);

  return (
    <>
      <div className={styles.noise} />
      <main className={`${styles.main}`}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn(1.2, 1)}
          style={{ width: "100vw", height: "100vh" }}
        >
          <Canvas>
            {scene}
            {rotation}
          </Canvas>
        </motion.div>
        <div className={styles.title}>
          <motion.h2 initial="initial" animate="animate" variants={fadeIn(0)}>
            david.mov
          </motion.h2>
          <motion.p
            initial="initial"
            animate="animate"
            variants={fadeIn(0.3)}
            className={styles.info}
          >
            Please enjoy.
          </motion.p>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn(0.3)}
          >
            {/* <Info onClick={() => setInfoVisible(true)} /> */}
            {/* <InfoPanel visible={infoVisible} /> */}
          </motion.div>
        </div>
        {!client && <LoadingAnimation className={styles.loader} />}
        <div className={styles.cta}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn(0.6)}
            onClick={() => prev()}
          >
            <Button className={styles.button}>
              <ArrowLeft />
            </Button>
          </motion.div>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn(0.9)}
          >
            <Button
              className={styles.button}
              onClick={() => setZoom(zoom < 50 ? 50 : -80)}
            >
              {zoom < 50 ? <ZoomIn /> : <ZoomOut />}
            </Button>
          </motion.div>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn(1.2)}
            onClick={() => next()}
          >
            <Button className={styles.button}>
              <ArrowRight />
            </Button>
          </motion.div>
        </div>
        <motion.div className={styles.extraSites}>
          <a href="https://www.download.zip" target="_blank">
            download.zip
          </a>
          <a href="https://www.feliznavi.dad" target="_blank">
            feliznavi.dad
          </a>
        </motion.div>
      </main>
    </>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>website.mov</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <Content />
      </ThemeProvider>
    </>
  );
}
