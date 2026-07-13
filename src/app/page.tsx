import Clock from "@/components/Clock";
import Header from "@/components/Header";
import ProfilePhoto from "@/components/ProfilePhoto";
import StudentCard from "@/components/StudentCard";
import VideoBackground from "@/components/VideoBackground";
import { userProfile } from "@/config/profile";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Clock />
      {/* Zona inferior: el video (recortado a su mitad inferior) cubre
          desde la foto hasta el fondo; la foto y la tarjeta van encima. */}
      <div className={styles.bottomArea}>
        <VideoBackground src="/background.mp4" />
        <div className={styles.photoSection}>
          <ProfilePhoto
            src={userProfile.photo}
            alt={`Foto de ${userProfile.firstNames}`}
          />
        </div>
        <StudentCard profile={userProfile} />
      </div>
    </main>
  );
}
