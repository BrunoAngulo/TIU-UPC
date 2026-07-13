"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const openModal = () => {
    setTempFirst(firstName);
    setTempLast(lastName);
    setShowModal(true);
  };

  const saveAndClose = useCallback(() => {
    setFirstName(tempFirst.trim() || firstName);
    setLastName(tempLast.trim() || lastName);
    setShowModal(false);
  }, [tempFirst, tempLast, firstName, lastName]);

  const cancel = useCallback(() => {
    setShowModal(false);
  }, []);

  // Close only when tapping directly on the overlay background
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        cancel();
      }
    },
    [cancel]
  );

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
        <div
          ref={overlayRef}
          className={styles.overlay}
          onClick={handleOverlayClick}
        >
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Editar nombre</h3>

            <label className={styles.modalLabel}>
              Nombres
              <input
                ref={firstInputRef}
                className={styles.modalInput}
                type="text"
                value={tempFirst}
                onChange={(e) => setTempFirst(e.target.value)}
              />
            </label>

            <label className={styles.modalLabel}>
              Apellidos
              <input
                className={styles.modalInput}
                type="text"
                value={tempLast}
                onChange={(e) => setTempLast(e.target.value)}
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
