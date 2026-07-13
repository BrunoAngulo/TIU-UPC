"use client";

import { useEffect, useState } from "react";
import styles from "./Clock.module.css";

function formatTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(date: Date): string {
  const weekday = capitalize(
    date.toLocaleDateString("es-PE", { weekday: "long" })
  );
  const day = date.getDate();
  const month = capitalize(
    date.toLocaleDateString("es-PE", { month: "short" }).replace(".", "")
  );
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export default function Clock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(formatTime(now));
      setDate(formatDate(now));
    };
    update();
    setMounted(true);
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until client is mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.timePill}>
          <span className={styles.time}>&nbsp;</span>
        </div>
        <p className={styles.date}>&nbsp;</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.timePill}>
        <span className={styles.time}>{time}</span>
      </div>
      <p className={styles.date}>{date}</p>
    </div>
  );
}
