import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { Canvas, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Html,
  PresentationControls,
  Sky,
  Plane,
} from "@react-three/drei";
import { ArrowLeft, ArrowRight, AlignJustify } from "react-feather";
import { motion } from "framer-motion";
import * as THREE from "three";

import { useClient, useTimeline } from "../hooks";
import { ThemeProvider } from "../context/themeContext";
import { LoadingAnimation } from "../components/loadingAnimation";

import styles from "./index.module.scss";

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

const Model = ({ path, zoom, video }) => {
  const { scene } = useGLTF(path);
  const { gl } = useThree();

  // Enable shadows in the WebGLRenderer
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  const getZoom = () => {
    return (zoom / 80) * 1.5;
  };

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
        position={[-1.7, -2.2, getZoom()]}
        scale={[0.8, 0.8, 0.8]}
      >
        <Html wrapperClass={styles.computer} position={[2.1, 3, 0]}>
          <iframe
            style={{ transform: `scale(${0.9 + 0.3 * (zoom / 50)}` }}
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
  const scrollContainerRef = useRef(null);
  const [zoom, setZoom] = useState(0);
  const { client } = useClient();
  const { step, next, prev } = useTimeline(0, videoIds.length - 1, true);
  const [video, setVideo] = useState(videoIds[step]);

  const handleDrag = (info) => {
    const scrollbarHeight = 12 * 16; // Height of the scrollbar in pixels (assuming 1rem = 16px)

    if (!scrollContainerRef.current) return;

    const containerHeight = scrollContainerRef.current.offsetHeight;

    // Calculate the percentage based on the y position.
    const percentage =
      100 - (info.point.y / (containerHeight - scrollbarHeight)) * 100;

    // Clamp the percentage value between 0 and 100
    const clampedPercentage = Math.floor(Math.min(Math.max(percentage, 0), 80));
    setZoom(clampedPercentage);
  };

  const getDragConstraints = () => {
    if (!scrollContainerRef.current) {
      return { top: 0, bottom: 0 };
    }

    const containerHeight = scrollContainerRef.current.offsetHeight;
    const scrollbarHeight = 12 * 16; // 12rem in pixels (assuming 1rem = 16px)
    const padding = 2 * 16; // 6rem in pixels (assuming 1rem = 16px)

    return { top: -(containerHeight - scrollbarHeight - padding), bottom: 0 };
  };

  useEffect(() => {
    // If step changes, set the new video ID.
    setVideo(videoIds[step]);
  }, [step]);

  console.log(video);

  return (
    <main className={`${styles.main}`}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn(1.2, 1)}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[-10, 10, 0]} intensity={0.8} />
          {client && (
            <Model path="/assets/monitor.glb" zoom={zoom} video={video} />
          )}
        </Canvas>
      </motion.div>
      <div className={styles.title}>
        <motion.h2 initial="initial" animate="animate" variants={fadeIn(0)}>
          david.mov
        </motion.h2>
        <motion.p initial="initial" animate="animate" variants={fadeIn(0.3)}>
          Please enjoy.
        </motion.p>
      </div>
      {!client && <LoadingAnimation className={styles.loader} />}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn(1.5)}
        className={styles.scroll}
        ref={scrollContainerRef}
      >
        <motion.div
          className={styles.scrollbar}
          drag="y"
          onDrag={(_, info) => handleDrag(info)}
          dragConstraints={getDragConstraints()}
          whileDrag={{ scale: 1.05 }}
          dragMomentum={false}
        >
          <AlignJustify />
        </motion.div>
      </motion.div>
      <div className={styles.cta}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn(0.6)}
          onClick={() => prev()}
        >
          <ArrowLeft /> prev
        </motion.div>
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn(0.9)}
          onClick={() => next()}
        >
          next <ArrowRight />
        </motion.div>
      </div>
    </main>
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
