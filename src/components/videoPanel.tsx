import React, { useRef } from 'react';
import { VideoTexture } from 'three';

interface VideoPanelProps {
  videoUrl: string;
}


export const VideoPanel = ({ videoUrl }: VideoPanelProps) => {
  const mesh = useRef();
  const aspectRatio = 16 / 9;

  const video = document.createElement('video');
  video.src = videoUrl;
  video.loop = true;
  video.load();
  video.play();

  const texture = new VideoTexture(video);

  return (
    <mesh ref={mesh.current}>
      <planeBufferGeometry args={[aspectRatio, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};
