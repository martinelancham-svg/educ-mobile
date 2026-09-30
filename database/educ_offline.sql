-- ============================================================================
-- SCRIPT DE BASE DE DATOS MYSQL / MARIADB PARA XAMPP (phpMyAdmin)
-- PLATAFORMA EDUC-OFFLINE GUINEA ECUATORIAL (MALABO, BATA, EBEBIYÍN)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `educ_offline` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `educ_offline`;

-- ----------------------------------------------------------------------------
-- 1. TABLA DE USUARIOS (Administradores, Profesores y Estudiantes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) UNIQUE NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
  `telefono` VARCHAR(50) DEFAULT NULL,
  `edad` INT DEFAULT 18,
  `escuela` VARCHAR(200) DEFAULT 'Colegio Nacional Rey Malabo',
  `curso` VARCHAR(100) DEFAULT '4° ESO',
  `nodo_conexion` VARCHAR(100) DEFAULT 'Nodo Malabo Central-01',
  `estado_conexion` ENUM('ONLINE', 'RECENT', 'OFFLINE') DEFAULT 'ONLINE',
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Usuarios Iniciales
INSERT INTO `usuarios` (`uuid`, `nombre`, `email`, `password_hash`, `rol`, `telefono`, `edad`, `escuela`, `curso`, `nodo_conexion`) VALUES
('usr-admin-01', 'Administrador Central EDUC-OFFLINE', 'admin@educ-offline.org', '$2a$10$e8T...hash_admin', 'admin', '+240 222 00 00 00', 35, 'Ministerio de Educación (Malabo)', 'Administración Central', 'Nodo Malabo USB-01'),
('usr-tcher-01', 'Prof. Baltasar Nsue Ondo', 'baltasar.nsue@unge.gq', '$2a$10$e8T...hash_teacher', 'teacher', '+240 222 88 44 20', 42, 'UNGE & Instituto Politécnico de Bata', 'Catedrático de Matemáticas & Física', 'Nodo Bata Central-04'),
('usr-tcher-02', 'Dra. Solange Nguema Avomo', 'solange.nguema@unge.gq', '$2a$10$e8T...hash_teacher', 'teacher', '+240 222 99 32 10', 38, 'Instituto Nacional Rey Malabo', 'Biología & Ciencias de la Tierra', 'Nodo Malabo Norte-02'),
('usr-studt-01', 'Mariano Nsue Nchama', 'mariano.nsue@estudiante.gq', '$2a$10$e8T...hash_student', 'student', '+240 222 11 22 33', 15, 'Colegio Nacional Rey Malabo', '4° ESO', 'Nodo Malabo USB-01'),
('usr-studt-02', 'Esperanza Obono Nsue', 'esperanza.obono@estudiante.gq', '$2a$10$e8T...hash_student', 'student', '+240 222 44 55 66', 16, 'Instituto Politécnico de Bata', 'Física y Química ESO', 'Nodo Bata Central-04'),
('usr-studt-03', 'Pascal Eto\'o Nchama', 'pascal.etoo@estudiante.gq', '$2a$10$e8T...hash_student', 'student', '+240 222 77 88 99', 17, 'Instituto Nacional de Malabo', 'Bachillerato & Selectividad', 'Nodo Malabo Norte-02');

-- ----------------------------------------------------------------------------
-- 2. TABLA DE TUTORES Y PADRES DE MENORES (Obligatorio menores < 18)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `estudiantes_tutores`;
CREATE TABLE `estudiantes_tutores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `estudiante_id` INT NOT NULL,
  `nombre_tutor` VARCHAR(150) NOT NULL,
  `telefono_whatsapp_tutor` VARCHAR(50) NOT NULL,
  `relacion_menor` ENUM('Padre/Madre', 'Tutor Legal', 'Abuelo/Abuela', 'Hermano/a Mayor', 'Director del Centro', 'Otro') DEFAULT 'Padre/Madre',
  `pais_region` VARCHAR(100) DEFAULT 'Guinea Ecuatorial (Malabo / Bata)',
  `comentario_motivacion` TEXT DEFAULT NULL,
  `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Tutores
INSERT INTO `estudiantes_tutores` (`estudiante_id`, `nombre_tutor`, `telefono_whatsapp_tutor`, `relacion_menor`, `comentario_motivacion`) VALUES
(4, 'Santiago Nsue (Padre)', '+240 222 77 88 99', 'Padre/Madre', 'Deseo supervisar el progreso de mi hijo en matemáticas y recibir boletines.'),
(5, 'Clara Nchama (Madre)', '+240 222 44 11 22', 'Padre/Madre', 'Interesada en la preparación para Selectividad UNGE.');

-- ----------------------------------------------------------------------------
-- 3. TABLA DE SALAS DE EXAMEN SEGURO (Lockdown Mode)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `salas_examen`;
CREATE TABLE `salas_examen` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo_pin` VARCHAR(20) UNIQUE NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `asignatura` VARCHAR(100) NOT NULL,
  `duracion_minutos` INT NOT NULL DEFAULT 60,
  `max_participantes` INT NOT NULL DEFAULT 30,
  `modo_estricto` TINYINT(1) DEFAULT 1,
  `profesor_id` INT NOT NULL,
  `estado` ENUM('WAITING', 'EXAM_RUNNING', 'CLOSED') DEFAULT 'EXAM_RUNNING',
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`profesor_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Salas de Examen
INSERT INTO `salas_examen` (`codigo_pin`, `titulo`, `asignatura`, `duracion_minutos`, `modo_estricto`, `profesor_id`, `estado`) VALUES
('EXAM-8F42K', 'Curso Completo de Matemáticas: De Álgebra a Geometría', 'Matemáticas & Álgebra', 45, 1, 2, 'EXAM_RUNNING'),
('EXAM-7251K', 'Evaluación Parcial de Física y Química ESO', 'Física y Química', 30, 0, 3, 'EXAM_RUNNING'),
('EXAM-9910K', 'Examen Diagnóstico de Biología y Ciencias', 'Biología', 60, 1, 3, 'WAITING');

-- ----------------------------------------------------------------------------
-- 4. TABLA DE INCIDENCIAS DE EXAMEN (Detección de Abandono / Pérdida de Foco)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `incidencias_examen`;
CREATE TABLE `incidencias_examen` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sala_id` INT NOT NULL,
  `estudiante_id` INT NOT NULL,
  `motivo_incidencia` TEXT NOT NULL,
  `estado` ENUM('INCIDENT_PENDING', 'AUTHORIZED', 'REJECTED') DEFAULT 'INCIDENT_PENDING',
  `fecha_incidencia` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sala_id`) REFERENCES `salas_examen`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Incidencias
INSERT INTO `incidencias_examen` (`sala_id`, `estudiante_id`, `motivo_incidencia`, `estado`) VALUES
(1, 4, 'Abandono de pantalla detectado (minimización de app o cambio de pestaña)', 'INCIDENT_PENDING'),
(2, 6, 'Pérdida de conexión local por 2 minutos', 'AUTHORIZED');

-- ----------------------------------------------------------------------------
-- 5. TABLA DE BIBLIOTECA DIGITAL EDUCATIVA
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `biblioteca_digital`;
CREATE TABLE `biblioteca_digital` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `tipo_formato` ENUM('libro', 'pdf', 'articulo', 'presentacion', 'video', 'audio', 'academico') NOT NULL,
  `asignatura` VARCHAR(100) NOT NULL,
  `nivel_educativo` VARCHAR(100) NOT NULL,
  `autor` VARCHAR(150) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `tamano_mb` VARCHAR(20) DEFAULT '5.0 MB',
  `descargas_count` INT DEFAULT 0,
  `valoracion` DECIMAL(3,1) DEFAULT 4.9,
  `hashtags` VARCHAR(255) DEFAULT '#Educacion, #Offline, #UNGE',
  `nombre_archivo_local` VARCHAR(255) DEFAULT NULL,
  `publicado_por_id` INT NOT NULL,
  `fecha_publicacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`publicado_por_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Biblioteca Digital
INSERT INTO `biblioteca_digital` (`titulo`, `tipo_formato`, `asignatura`, `nivel_educativo`, `autor`, `descripcion`, `tamano_mb`, `descargas_count`, `hashtags`, `publicado_por_id`) VALUES
('Libro Oficial de Matemáticas 4° ESO & Bachillerato', 'libro', 'Matemáticas & Álgebra', 'Secundaria Obligatoria (ESO)', 'Ministerio de Educación GNQ', 'Manual completo con explicaciones teóricas y ejercicios resueltos.', '14.2 MB', 1420, '#Matemáticas, #ESO, #LibroOficial', 1),
('Modelos de Examen y Solucionario Selectividad UNGE 2025/2026', 'academico', 'Matemáticas & Álgebra', 'Bachillerato & Selectividad', 'Comisión Evaluadora UNGE', 'Compilado oficial de exámenes de acceso a la UNGE.', '6.5 MB', 2310, '#Selectividad, #UNGE, #ExamenesOficiales', 1),
('Guía Práctica de Reacciones Químicas & Ley de Ohm', 'pdf', 'Física & Química', 'Secundaria Obligatoria (ESO)', 'Dra. Solange Nguema Avomo', 'Guía resumida en formato PDF comprimido ideal para estudiar sin conexión.', '3.8 MB', 1150, '#Química, #Reacciones, #GuíaPDF', 3);

-- ----------------------------------------------------------------------------
-- 6. TABLA DE PRECIOS Y PAQUETES CLASES PARTICULARES
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `precios_clases`;
CREATE TABLE `precios_clases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo_paquete` VARCHAR(150) NOT NULL,
  `tipo_modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') DEFAULT 'PRESENCIAL',
  `precio_xaf` INT NOT NULL,
  `duracion_sesion` VARCHAR(50) DEFAULT '1 hora',
  `descuento_porcentaje` INT DEFAULT 0,
  `incluye_material_offline` TINYINT(1) DEFAULT 1,
  `estado` ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Precios Clases Particulares
INSERT INTO `precios_clases` (`titulo_paquete`, `tipo_modalidad`, `precio_xaf`, `duracion_sesion`, `descuento_porcentaje`) VALUES
('Clase Individual Presencial (Malabo / Bata)', 'PRESENCIAL', 15000, '1 hora y 30 min', 0),
('Paquete Mensual 8 Sesiones de Refuerzo', 'HIBRIDA', 85000, '8 Sesiones (12 Horas Totales)', 15),
('Preparación Intensiva Selectividad UNGE', 'PRESENCIAL', 120000, 'Módulo de 1 Mes Completo', 20);

-- ----------------------------------------------------------------------------
-- 7. TABLA DE CONSULTAS DIRECTAS Y MENSAJES (Canal Directo)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `consultas_directas`;
CREATE TABLE `consultas_directas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `emisor_id` INT NOT NULL,
  `receptor_id` INT NOT NULL,
  `mensaje` TEXT NOT NULL,
  `leido` TINYINT(1) DEFAULT 0,
  `fecha_envio` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`emisor_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receptor_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla Consultas
INSERT INTO `consultas_directas` (`emisor_id`, `receptor_id`, `mensaje`) VALUES
(1, 2, 'Estimado Prof. Baltasar, favor revisar la solicitud de reincorporación del alumno Mariano Nsue.'),
(4, 2, 'Hola profesor, tengo una duda con el ejercicio 4 del módulo de funciones cuadráticas.');

-- ============================================================================
-- FIN DEL SCRIPT SQL - EDUC-OFFLINE
-- ============================================================================
