# 🐘 Guía Completa de Configuración de Base de Datos MySQL con XAMPP (phpMyAdmin)

Guía paso a paso para configurar la base de datos **`educ_offline`** en tu entorno **XAMPP**.

---

## 🚀 PASO 1: Iniciar los Servicios en XAMPP
1. Abre el **XAMPP Control Panel** en tu ordenador Windows.
2. Haz clic en **`Start`** en los módulos:
   - **`Apache`** (Fondo verde `Running`)
   - **`MySQL`** (Fondo verde `Running`)

---

## 📥 PASO 2: Importar la Base de Datos en phpMyAdmin
1. Abre tu navegador web y entra a: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)
2. En el menú superior, haz clic en la pestaña **`Importar`** (o *Import*).
3. Haz clic en **`Seleccionar archivo`** (Choose File) y elige el script SQL ubicado en este proyecto:
   - **Ruta**: `c:\Users\HP\.gemini\antigravity-ide\scratch\educ-offline\database\educ_offline.sql`
4. Desplázate hacia abajo y presiona el botón **`Importar`** (Go).
5. ¡Listo! Se creará automáticamente la base de datos **`educ_offline`** con sus 7 tablas y datos iniciales de prueba.

---

## 📊 Tablas Creadas Automáticamente:

| Nombre de Tabla | Descripción |
| :--- | :--- |
| **`usuarios`** | Almacena administradores, profesores y alumnos con roles y datos de conexión. |
| **`estudiantes_tutores`** | Datos de tutores legales para alumnos menores de edad (Sección 3). |
| **`salas_examen`** | Registro de salas de examen seguro por código PIN y modo estricto lockdown. |
| **`incidencias_examen`** | Registra abandonos de pantalla, minimización y solicitudes de reincorporación. |
| **`biblioteca_digital`** | Repositorio de libros, PDFs, guías, vídeos y audios offline. |
| **`precios_clases`** | Paquetes de precios de clases particulares presenciales y virtuales. |
| **`consultas_directas`** | Mensajes de comunicación instantánea entre admin, profesores y alumnos. |

---

## ⚙️ PASO 3: Parámetros de Conexión en Node.js (Si usas Backend)

- **Host**: `localhost`
- **Puerto**: `3306`
- **Usuario**: `root`
- **Contraseña**: *(Vía libre / Vacía por defecto en XAMPP)*
- **Base de Datos**: `educ_offline`

---

## 💡 ¿Necesitas un Backend Express.js listo?
El archivo [db_connect.js](file:///c:/Users/HP/.gemini/antigravity-ide/scratch/educ-offline/database/db_connect.js) ya contiene el código con `mysql2` para realizar consultas SQL directamente a tu XAMPP local.
