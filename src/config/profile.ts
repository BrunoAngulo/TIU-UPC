/**
 * Datos del usuario mostrados en la TIU Virtual.
 * Edita este archivo para cambiar nombre, carrera, códigos o foto
 * sin tocar la lógica ni los componentes.
 */
export interface UserProfile {
  /** Nombres (primera línea, en rojo) */
  firstNames: string;
  /** Apellidos (segunda línea, en rojo) */
  lastNames: string;
  studentCode: string;
  bannerId: string;
  career: string;
  campus: string;
  /** Ruta de la foto dentro de /public (ej. "/profile.jpg") */
  photo: string;
}

export const userProfile: UserProfile = {
  firstNames: "BRUNO RICARDO ADRIAN",
  lastNames: "A*** P***",
  studentCode: "U202424121",
  bannerId: "N00875000",
  career: "INGENIERÍA DE SISTEMAS EPE",
  campus: "Campus Villa",
  photo: "/profile.svg",
};
