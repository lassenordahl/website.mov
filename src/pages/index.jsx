import { useContext, useState, useRef, useEffect } from "react";
import Head from "next/head";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Html,
  PresentationControls,
  Sky,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { Sun, Moon, AlignJustify } from "react-feather";
import { motion } from "framer-motion";
import * as THREE from "three";

import { useClient } from "../hooks";
import { ThemeContext, ThemeProvider } from "../context/themeContext";
import { LoadingAnimation } from "../components/loadingAnimation";

import styles from "./index.module.scss";

const videoId = process.env.NEXT_PUBLIC_VIDEO_ID;

const Model = ({ path, zoom }) => {
  const { scene } = useGLTF(path);

  const getZoom = () => {
    return (zoom / 80) * 1.5;
  }

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
        <Html wrapperClass={styles.computer} position={[2.05, 3, 0]}>
          <iframe
            style={{ transform: `scale(${0.9 + 0.3 * (zoom / 50)}` }}
            src={`https://www.youtube.com/embed/${videoId}`}
          />
        </Html>
      </primitive>
    </PresentationControls>
  );
};

const Content = () => {
  const scrollContainerRef = useRef(null);
  const [zoom, setZoom] = useState(0);
  const { client } = useClient();

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

  return (
    <main className={`${styles.main}`}>
      <Canvas>
        <ambientLight intensity={1} />
        <ambientLight intensity={0.5} />
        <Sky distance={450000} sunPosition={[0, 40, 0]} inclination={0} />
        {client && <Model path="/assets/monitor.glb" zoom={zoom} />}
      </Canvas>
      <div className={styles.title}>
        <h2>david.mov</h2>
        <p>Please enjoy.</p>
      </div>
      {!client && <LoadingAnimation className={styles.loader} />}
      <div className={styles.scroll} ref={scrollContainerRef}>
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
