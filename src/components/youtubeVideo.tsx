import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from "./youtubeVideo.module.scss";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID;

const circleVariants = {
  small: {
    scale: 1,
    opacity: 0.1,
    skewX: 10,
    skewY: 15,
    rotateX: -10,
    rotateY: 5,
  },
  large: {
    scale: 1.2,
    opacity: 0.3,
    skewX: 10,
    skewY: 15,
    rotateX: -10,
    rotateY: 5,
  },
};

const iframeVariants = {
  up: {
    transform:
      "translate(-50%, -41%) skew(10deg, 15deg) rotateX(-10deg) rotateY(5deg)",
  },
  down: {
    transform:
      "translate(-50%, -45%) skew(10deg, 15deg) rotateX(-10deg) rotateY(5deg)",
  },
};

const YouTubeVideo = () => {
  const [videoId, setVideoId] = useState<string | undefined>(undefined);
  const [videoIndex, setVideoIndex] = useState(0);

  const fetchLatestVideo = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`
      );
      const data = await response.json();
      const video = data.items[videoIndex];
      setVideoId(video.id.videoId);
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      setVideoId("SHOf1Wlgpek");
    }
  }, [videoIndex]);

  useEffect(() => {
    console.log("fetching");
    fetchLatestVideo();
  }, [fetchLatestVideo]);

  const handleNextVideo = () => {
    setVideoIndex(videoIndex + 1);
  };

  if (!videoId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <motion.div
        className={styles.youtubeVideo}
        initial="down"
        animate="up"
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        variants={iframeVariants}
      >
        <iframe
          frameBorder="0"
          title="YouTube Video"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
      <motion.div
        onClick={() => handleNextVideo()}
        className={styles.circle}
        initial="small"
        animate="large"
        exit="small"
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        variants={circleVariants}
      ></motion.div>
    </>
  );
};

export default YouTubeVideo;
