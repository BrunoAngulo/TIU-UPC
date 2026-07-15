import axios from 'axios';
import * as ExcelJS from 'exceljs';

// ==========================================
// CONFIGURACIÓN (REEMPLAZAR CON TUS VALORES)
// ==========================================
const API_TOKEN = process.env.PEGASUS_TOKEN || "TU_BEARER_TOKEN_AQUI"; // Token de autorización (Bearer o Cookie)
const EMPRESA_ID = 11;
const CICLO_ESCOLAR_ID = 207;

// Lista de colegios donde se crearán los alumnos y profesores
const colegiosIds = [2326]; // Agrega aquí más IDs separados por comas

// Configuración para Primaria
const configPrimaria = {
    nivelId: 39,
    gradoId: 119,
    grupoId: 661
};

// Configuración para Secundaria (REEMPLAZAR CON LOS IDs CORRECTOS DE SECUNDARIA)
const configSecundaria = {
    nivelId: 40, // Asumiendo que 40 es secundaria
    gradoId: 0,  // REEMPLAZAR
    grupoId: 0   // REEMPLAZAR
};

// ==========================================
// CLIENTE AXIOS
// ==========================================
const api = axios.create({
    baseURL: 'https://www.uno-internacional.com/pegasus-api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`, // Ajustar si usas Cookie en lugar de Bearer
        // 'Cookie': `tu_cookie_aqui`
    }
});

// ==========================================
// FUNCIONES DE API
// ==========================================

async function validarIdentificador(colegioId: number, nivelId: number, identificador: string) {
    const payload = { colegioId, cicloEscolarId: CICLO_ESCOLAR_ID, nivelId: String(nivelId), personaId: 0, identificador };
    const res = await api.post(`/dashboard/empresas/${EMPRESA_ID}/validarIdentificador`, payload);
    return res.data;
}

async function crearAlumno(colegioId: number, config: any, idOficial: string, nombre: string, apellidoMaterno: string) {
    const payload = {
        nombre,
        apellidoPaterno: "demo",
        apellidoMaterno,
        fechaNacimiento: "2000-01-01T00:00:00.000Z",
        sexo: "M",
        extranjero: false,
        idOficial
    };
    const url = `/censo/empresas/${EMPRESA_ID}/ciclos/${CICLO_ESCOLAR_ID}/colegios/${colegioId}/niveles/${config.nivelId}/grados/${config.gradoId}/grupos/${config.grupoId}/alumnos`;
    const res = await api.post(url, payload);
    return res.data.data;
}

async function validarLogin(login: string) {
    const payload = { login, personaId: 0, gradoId: 0 };
    const res = await api.post(`/dashboard/empresas/${EMPRESA_ID}/validarLogin`, payload);
    return res.data;
}

async function actualizarLoginAlumno(colegioId: number, config: any, alumnoId: number, login: string) {
    const password = login.toUpperCase().replace('-', '');
    const payload = { login, password };
    const url = `/censo/empresas/${EMPRESA_ID}/ciclos/${CICLO_ESCOLAR_ID}/colegios/${colegioId}/niveles/${config.nivelId}/grados/${config.gradoId}/grupos/${config.grupoId}/alumnos/${alumnoId}/updateLogin`;
    const res = await api.put(url, payload);
    return res.data.data;
}

async function crearProfesor(colegioId: number, idOficial: string) {
    const payload = {
        nombre: "PROFESOR",
        apellidoPaterno: "DEMO",
        apellidoMaterno: "COLEGIO",
        sexo: "M",
        email: "demo@gmail.com",
        idOficial
    };
    // Se usa el nivel 38 (Inicial) como base para crearlo según el ejemplo
    const url = `/censo/empresas/${EMPRESA_ID}/ciclos/${CICLO_ESCOLAR_ID}/colegios/${colegioId}/niveles/38/profesores`;
    const res = await api.post(url, payload);
    return res.data.data;
}

async function asignarNivelesProfesor(colegioId: number, profesorId: number) {
    const payload = {
        niveles: [{ nivelId: 38 }, { nivelId: 39 }, { nivelId: 40 }]
    };
    const url = `/censo/empresas/${EMPRESA_ID}/ciclos/${CICLO_ESCOLAR_ID}/colegios/${colegioId}/profesores/${profesorId}/asignarNivel`;
    const res = await api.post(url, payload);
    return res.data.data;
}

async function actualizarLoginProfesor(colegioId: number, profesorId: number, login: string) {
    const password = login.toUpperCase().replace('-', '');
    const payload = { login, password };
    const url = `/censo/empresas/${EMPRESA_ID}/ciclos/${CICLO_ESCOLAR_ID}/colegios/${colegioId}/niveles/38/profesores/${profesorId}/updateLoginProfesor`;
    const res = await api.put(url, payload);
    return res.data.data;
}

// ==========================================
// FLUJO PRINCIPAL
// ==========================================

async function generarCuentasDemos() {
    console.log("Iniciando creación de cuentas demos...");
    
    // Resultados para guardar en el Excel
    const resultados: any[] = [];

    for (const colegioId of colegiosIds) {
        console.log(`\n--- Procesando Colegio ID: ${colegioId} ---`);

        try {
            // 1. ALUMNO PRIMARIA
            console.log("-> Creando Alumno Primaria...");
            let loginAP = `AP-${colegioId}`;
            let idAP = `13572${colegioId}1`; // Identificador simulado único
            await validarIdentificador(colegioId, configPrimaria.nivelId, idAP);
            const alumnoPrimaria = await crearAlumno(colegioId, configPrimaria, idAP, "alumno", "primaria");
            await validarLogin(loginAP);
            await actualizarLoginAlumno(colegioId, configPrimaria, alumnoPrimaria.alumnoId, loginAP);
            
            resultados.push({
                Colegio: colegioId,
                Rol: "Alumno Primaria",
                Usuario: loginAP,
                Contrasena: loginAP.toUpperCase().replace('-', '')
            });
            console.log(`   OK: ${loginAP}`);

            // 2. ALUMNO SECUNDARIA
            console.log("-> Creando Alumno Secundaria...");
            let loginAS = `AS-${colegioId}`;
            let idAS = `13572${colegioId}2`; // Identificador simulado único
            await validarIdentificador(colegioId, configSecundaria.nivelId, idAS);
            const alumnoSecundaria = await crearAlumno(colegioId, configSecundaria, idAS, "alumno", "secundaria");
            await validarLogin(loginAS);
            await actualizarLoginAlumno(colegioId, configSecundaria, alumnoSecundaria.alumnoId, loginAS);
            
            resultados.push({
                Colegio: colegioId,
                Rol: "Alumno Secundaria",
                Usuario: loginAS,
                Contrasena: loginAS.toUpperCase().replace('-', '')
            });
            console.log(`   OK: ${loginAS}`);

            // 3. PROFESOR
            console.log("-> Creando Profesor...");
            let loginPC = `PC-${colegioId}`;
            let idPC = `13572${colegioId}3`; // Identificador simulado único
            const profesor = await crearProfesor(colegioId, idPC);
            await asignarNivelesProfesor(colegioId, profesor.personaId);
            await validarLogin(loginPC);
            await actualizarLoginProfesor(colegioId, profesor.personaId, loginPC);
            
            resultados.push({
                Colegio: colegioId,
                Rol: "Profesor",
                Usuario: loginPC,
                Contrasena: loginPC.toUpperCase().replace('-', '')
            });
            console.log(`   OK: ${loginPC}`);

        } catch (error: any) {
            console.error(`Error procesando el colegio ${colegioId}:`, error?.response?.data || error.message);
        }
    }

    // ==========================================
    // EXPORTAR A EXCEL
    // ==========================================
    if (resultados.length > 0) {
        console.log("\nGenerando archivo Excel...");
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Cuentas Demos');

        sheet.columns = [
            { header: 'Colegio ID', key: 'Colegio', width: 15 },
            { header: 'Rol', key: 'Rol', width: 25 },
            { header: 'Usuario', key: 'Usuario', width: 20 },
            { header: 'Contraseña', key: 'Contrasena', width: 20 }
        ];

        // Formato de cabeceras
        sheet.getRow(1).font = { bold: true };
        
        resultados.forEach(res => {
            sheet.addRow(res);
        });

        const fileName = 'Cuentas_Demos_Pegasus.xlsx';
        await workbook.xlsx.writeFile(fileName);
        console.log(`¡Archivo Excel generado exitosamente!: ${fileName}`);
    } else {
        console.log("\nNo se generó el Excel porque no hubo cuentas creadas.");
    }
}

generarCuentasDemos();
