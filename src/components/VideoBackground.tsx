"use client";

import { useEffect, useRef } from "react";
import styles from "./VideoBackground.module.css";

interface VideoBackgroundProps {
  src: string;
}

export default function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Garantiza la reproducción aunque el navegador pause el video
  // (recargas, pestaña en segundo plano, etc.)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {
        /* autoplay bloqueado: el video queda como imagen estática */
      });
    };
    const onVisible = () => {
      if (!document.hidden) play();
    };

    play();
    video.addEventListener("pause", play);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      video.removeEventListener("pause", play);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={styles.video}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />
  );
}
