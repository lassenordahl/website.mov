import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

import styles from "./youtubeVideo.module.scss";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID;

const circleVariants = {
  small: {
    scale: 1,
    opacity: 0.1,
  },
  large: {
    scale: 1.2,
    opacity: 0.3,
  },
};

const iframeVariants = {
  up: {
    transform: "translate(-50%, -45%)",
  },
  down: {
    transform: "translate(-50%, -50%)",
  },
};

const YouTubeVideo = ({ onReady }) => {
  const [videoId, setVideoId] = useState("SHOf1Wlgpek");
  const playerRef = useRef(null);

  useEffect(() => {
    if (onReady && playerRef.current) {
      onReady(playerRef.current);
    }
  }, [onReady]);

  if (!videoId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <motion.div
        className={styles.youtubeVideo}
        // initial="down"
        // animate="up"
        // transition={{
        //   duration: 3,
        //   repeat: Infinity,
        //   repeatType: "mirror",
        //   ease: "easeInOut",
        // }}
        variants={iframeVariants}
      >
        <iframe
          frameBorder={0}
          ref={playerRef}
          title="YouTube Video"
          width="400"
          height="240"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </>
  );
};

export default YouTubeVideo;
