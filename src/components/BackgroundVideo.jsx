import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function BackgroundVideo({
  src = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8",
  className = "w-full h-full object-cover",
  overlay = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {overlay && <div className="absolute inset-0 bg-black/30 z-[1]" />}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    </div>
  );
}
