import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <button className={styles.backButton} aria-label="Volver">
        <svg
          width="8"
          height="12"
          viewBox="0 0 14 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L3 11L12 20"
            stroke="#fd393b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className={styles.title}>TIU VIRTUAL</h1>
    </header>
  );
}
