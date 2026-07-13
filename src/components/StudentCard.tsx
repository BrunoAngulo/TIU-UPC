"use client";

import { useState, useRef, useEffect } from "react";
import type { UserProfile } from "@/config/profile";
import styles from "./StudentCard.module.css";

interface StudentCardProps {
  profile: UserProfile;
}

export default function StudentCard({ profile }: StudentCardProps) {
  const [firstName, setFirstName] = useState(profile.firstNames);
  const [lastName, setLastName] = useState(profile.lastNames);
  const [showModal, setShowModal] = useState(false);
  const [tempFirst, setTempFirst] = useState(firstName);
  const [tempLast, setTempLast] = useState(lastName);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal) {
      // Small delay to let the modal render before focusing
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [showModal]);

  const openModal = () => {
    setTempFirst(firstName);
    setTempLast(lastName);
    setShowModal(true);
  };

  const saveAndClose = () => {
    setFirstName(tempFirst);
    setLastName(tempLast);
    setShowModal(false);
  };

  const cancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className={styles.card}>
        <h2 className={styles.name} onClick={openModal} title="Toca para editar">
          <span className={styles.nameLine}>{firstName}</span>
          <br />
          <span className={styles.nameLine}>{lastName}</span>
        </h2>

        <div className={styles.field}>
          <p className={styles.label}>Código de alumno:</p>
          <p className={styles.value}>{profile.studentCode}</p>
        </div>

        <div className={styles.field}>
          <p className={styles.label}>ID Banner:</p>
          <p className={styles.value}>{profile.bannerId}</p>
        </div>

        <p className={styles.career}>{profile.career}</p>

        <p className={styles.campus}>
          <span aria-hidden="true">📍</span> {profile.campus}
        </p>
      </section>

      {/* Modal para editar nombre */}
      {showModal && (
        <div className={styles.overlay} onClick={cancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Editar nombre</h3>

            <label className={styles.modalLabel}>
              Nombres
              <input
                ref={firstInputRef}
                className={styles.modalInput}
                type="text"
                value={tempFirst}
                onChange={(e) => setTempFirst(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveAndClose()}
              />
            </label>

            <label className={styles.modalLabel}>
              Apellidos
              <input
                className={styles.modalInput}
                type="text"
                value={tempLast}
                onChange={(e) => setTempLast(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveAndClose()}
              />
            </label>

            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={cancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={saveAndClose}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
