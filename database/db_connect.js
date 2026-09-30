/**
 * ARCHIVO DE CONEXIÓN A BASE DE DATOS MYSQL / MARIADB EN XAMPP
 * Requiere el paquete 'mysql2' de npm (npm install mysql2 express)
 */

const mysql = require('mysql2/promise');

// Configuración predeterminada de XAMPP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',        // Usuario por defecto en XAMPP
  password: process.env.DB_PASSWORD || '',   // Contraseña vacía por defecto en XAMPP
  database: process.env.DB_NAME || 'educ_offline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear Pool de Conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa a la Base de Datos MySQL en XAMPP (educ_offline)!');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL en XAMPP:', error.message);
    console.error('👉 Asegúrate de que los módulos Apache y MySQL estén en verde [Running] en el XAMPP Control Panel.');
  }
}

testConnection();

module.exports = pool;
