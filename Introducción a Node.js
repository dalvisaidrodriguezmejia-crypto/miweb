--Automatización de Tareas: Limpiador de Registros:

const fs = require('fs/promises');
const path = require('path');

async function limpiarLogsAntiguos() {
  const directorioLogs = path.join(__dirname, 'logs');
  const maxAntiguedadDias = 7;
  const maxAntiguedadMs = maxAntiguedadDias * 24 * 60 * 60 * 1000;
  const ahora = Date.now();

  try {
    // Leer todos los archivos del directorio
    const archivos = await fs.readdir(directorioLogs);

    for (const archivo of archivos) {
      const rutaCompleta = path.join(directorioLogs, archivo);
      const estadisticas = await fs.stat(rutaCompleta);

      // Calcular la diferencia de tiempo
      const tiempoArchivo = estadisticas.mtime.getTime();
      
      if (ahora - tiempoArchivo > maxAntiguedadMs) {
        await fs.unlink(rutaCompleta);
        console.log(` Archivo eliminado por antigüedad: ${archivo}`);
      }
    }
    console.log('Proceso de limpieza de logs finalizado.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('El directorio de logs no existe aún.');
    } else {
      console.error(' Error al limpiar logs:', error);
    }
  }
}

limpiarLogsAntiguos();

--Interacción con APIs y Servicios Web: Sincronización de Datos:

const fs = require('fs/promises');

async function sincronizarUsuarios() {
  const urlAPI = 'https://jsonplaceholder.typicode.com/users';
  const rutaDestino = './usuarios_sincronizados.json';

  try {
    console.log('Conectando a la API externa...');
    const respuesta = await fetch(urlAPI);

    if (!respuesta.ok) {
      throw new Error(`HTTP error! estado: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    
    // Transformar los datos antes de guardarlos
    const datosFiltrados = datos.map(usuario => ({
      id: usuario.id,
      nombre: usuario.name,
      email: usuario.email
    }));

    // Escribir los datos en un archivo local
    await fs.writeFile(rutaDestino, JSON.stringify(datosFiltrados, null, 2));
    console.log(` Sincronización exitosa. Datos guardados en ${rutaDestino}`);

  } catch (error) {
    console.error(' Error de sincronización:', error.message);
  }
}

sincronizarUsuarios();
