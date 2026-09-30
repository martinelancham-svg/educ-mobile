/**
 * EXPRESS API BACKEND SERVER CONECTADO A BASE DE DATOS MYSQL EN XAMPP
 * Database: educ_eg (phpMyAdmin)
 * Servidor: http://localhost:5000
 */

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN MYSQL XAMPP (phpMyAdmin)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'educ_eg',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test de Conexión en arranque
pool.getConnection()
  .then(conn => {
    console.log('✅ ¡CONECTADO CON ÉXITO A MYSQL XAMPP (educ_eg)!');
    conn.release();
  })
  .catch(err => {
    console.warn('⚠️ No se pudo conectar a MySQL XAMPP:', err.message);
    console.warn('👉 Asegúrate de tener XAMPP MySQL iniciado en el puerto 3306.');
  });

// ----------------------------------------------------------------------------
// ENDPOINTS REST API PARA PÁGINA WEB Y APP MÓVIL
// ----------------------------------------------------------------------------

// 1. ESTADO DE CONEXIÓN
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS total_usuarios FROM usuarios');
    res.json({
      status: 'ONLINE',
      database: 'educ_offline',
      source: 'XAMPP MySQL (phpMyAdmin)',
      totalUsuarios: rows[0].total_usuarios,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ status: 'OFFLINE_FALLBACK', error: error.message });
  }
});

// 2. OBTENER LISTADO DE USUARIOS (ADMIN, PROFESORES, ESTUDIANTES)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.*, t.nombre_tutor, t.telefono_whatsapp_tutor, t.relacion_menor
      FROM usuarios u
      LEFT JOIN estudiantes_tutores t ON u.id = t.estudiante_id
      ORDER BY u.id DESC
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. OBTENER SALAS DE EXAMEN SEGURO (LOCKDOWN MODE)
app.get('/api/exam-rooms', async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT s.*, u.nombre AS profesor_nombre
      FROM salas_examen s
      JOIN usuarios u ON s.profesor_id = u.id
      ORDER BY s.id DESC
    `);

    // Adjuntar incidencias para cada sala
    for (let r of rooms) {
      const [incidents] = await pool.query(`
        SELECT i.*, u.nombre AS estudiante_nombre
        FROM incidencias_examen i
        JOIN usuarios u ON i.estudiante_id = u.id
        WHERE i.sala_id = ?
      `, [r.id]);
      r.incidents = incidents;
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. CREAR NUEVA SALA DE EXAMEN
app.post('/api/exam-rooms', async (req, res) => {
  try {
    const { codigo_pin, titulo, asignatura, duracion_minutos, profesor_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO salas_examen (codigo_pin, titulo, asignatura, duracion_minutos, profesor_id) VALUES (?, ?, ?, ?, ?)',
      [codigo_pin, titulo, asignatura, duracion_minutos || 60, profesor_id || 2]
    );
    res.json({ message: 'Sala de examen creada exitosamente', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. OBTENER BIBLIOTECA DIGITAL
app.get('/api/digital-library', async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT b.*, u.nombre AS publicado_por_nombre
      FROM biblioteca_digital b
      JOIN usuarios u ON b.publicado_por_id = u.id
      ORDER BY b.id DESC
    `);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. PUBLICAR RECURSO EN BIBLIOTECA DIGITAL
app.post('/api/digital-library', async (req, res) => {
  try {
    const { titulo, tipo_formato, asignatura, nivel_educativo, autor, descripcion, tamano_mb, publicado_por_id } = req.body;
    const [result] = await pool.query(
      `INSERT INTO biblioteca_digital (titulo, tipo_formato, asignatura, nivel_educativo, autor, descripcion, tamano_mb, publicado_por_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, tipo_formato || 'pdf', asignatura || 'General', nivel_educativo || 'ESO', autor || 'Ministerio de Educación', descripcion || '', tamano_mb || '5.0 MB', publicado_por_id || 1]
    );
    res.json({ message: 'Recurso publicado con éxito', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. OBTENER Y GUARDAR PRECIOS CLASES PARTICULARES
app.get('/api/tutoring-prices', async (req, res) => {
  try {
    const [prices] = await pool.query('SELECT * FROM precios_clases ORDER BY id ASC');
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tutoring-prices', async (req, res) => {
  try {
    const { titulo_paquete, tipo_modalidad, precio_xaf, duracion_sesion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO precios_clases (titulo_paquete, tipo_modalidad, precio_xaf, duracion_sesion) VALUES (?, ?, ?, ?)',
      [titulo_paquete, tipo_modalidad || 'PRESENCIAL', precio_xaf, duracion_sesion || '1 hora']
    );
    res.json({ message: 'Paquete de precios guardado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. ENVIAR CONSULTA / MENSAJE CANAL DIRECTO
app.post('/api/consultations', async (req, res) => {
  try {
    const { emisor_id, receptor_id, mensaje } = req.body;
    const [result] = await pool.query(
      'INSERT INTO consultas_directas (emisor_id, receptor_id, mensaje) VALUES (?, ?, ?)',
      [emisor_id || 1, receptor_id || 2, mensaje]
    );
    res.json({ message: 'Mensaje transmitido', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// INICIAR SERVIDOR HTTP
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 EDUC-EG BACKEND API CORRIENDO EN PORT ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🗄️ Database MySQL XAMPP: educ_eg`);
  console.log(`===========================================================`);
});
