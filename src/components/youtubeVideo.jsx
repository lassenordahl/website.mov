import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

import styles from "./youtubeVideo.module.scss";

const iframeVariants = {
  up: {
    transform: "translate(-50%, -45%)",
  },
  down: {
    transform: "translate(-50%, -50%)",
  },
};

const YouTubeVideo = ({ onReady }) => {
  const [videoId, _] = useState(process.env.NEXT_PUBLIC_VIDEO_ID);
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
        variants={iframeVariants}
      >
        <iframe
          frameBorder={0}
          ref={playerRef}
          title="YouTube Video"
          width="212"
          height="180"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </>
  );
};

export default YouTubeVideo;
