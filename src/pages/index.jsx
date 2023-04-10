import { useContext, useState, useRef, useEffect } from "react";
import Head from "next/head";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";

import { useClient } from "../hooks";
import { ThemeContext, ThemeProvider } from "../context/themeContext";
import YouTubeVideo from "../components/youtubeVideo";
import cameraConfig from "../configs/camera.json";

import styles from "./index.module.scss";

const Model = ({ path, position, size, rotation }) => {
  const { nodes, materials, scene } = useGLTF(path);
  const { scene: r3fScene, camera } = useThree();
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      if (position) scene.position.set(position[0], position[1], position[2]);
      if (size) scene.scale.set(size[0], size[1], size[2]);
      if (rotation) scene.rotation.set(rotation[0], rotation[1], rotation[2]);

      r3fScene.add(scene);
      return () => {
        r3fScene.remove(scene);
      };
    }
  }, [r3fScene, scene, position, size, rotation]);

  return <group ref={groupRef}></group>;
};

function Wall({ position, rotation, dimensions }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxBufferGeometry args={dimensions} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}

const Content = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { client } = useClient();

  const themeClass = isDarkMode ? styles.dark : styles.light;

  return (
    <main className={`${styles.main} ${themeClass}`}>
      <Canvas>
        <ambientLight intensity={isDarkMode ? 0.3 : 1} />
        <pointLight position={[1, 100, 1]} intensity={isDarkMode ? 0.5 : 0} />
        {client && <Model path="/assets/crt_monitor.glb" />}
        <PerspectiveCamera
          makeDefault
          position={cameraConfig.position}
          rotation={cameraConfig.rotation}
        />
        {/* <OrbitControls /> */}
      </Canvas>
      <YouTubeVideo />
      <h2 className={styles.title} onClick={toggleTheme}>
        david.mov
      </h2>
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
