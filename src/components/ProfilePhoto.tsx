"use client";

import { ChangeEvent, useRef, useState } from "react";
import styles from "./ProfilePhoto.module.css";

interface ProfilePhotoProps {
  src: string;
  alt: string;
}

export default function ProfilePhoto({ src, alt }: ProfilePhotoProps) {
  const [photo, setPhoto] = useState(src);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
    // Reset the input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      {/* The visible photo circle — uses div with onClick for iOS compat */}
      <div
        className={styles.frame}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Cambiar foto de perfil"
        title="Toca para cambiar la foto"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.photo} src={photo} alt={alt} />
      </div>
      {/*
        The hidden file input is placed OUTSIDE the visible button,
        positioned off-screen. On iOS, we trigger it via .click() from
        a user-initiated event (the div's onClick), which Safari allows.
      */}
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
    </>
  );
}
