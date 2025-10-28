📘 Descripción General

    Esta API permite la gestión integral de un gimnasio, incluyendo administración de usuarios, membresías, roles, horarios, sesiones, pagos y asistencias, todo bajo un sistema seguro de autenticación JWT.

Características principales:

    Control completo de usuarios y roles (Admin, Entrenador, Cliente, Estudiante, Particular)
    Asignación dinámica de membresías y horarios
    Registro automatizado de pagos y asistencias
    Autenticación segura mediante JSON Web Token (JWT)
    Base de datos inicializada con datos reales mediante seeders

🧰 Tecnologías Utilizadas

    Node.js + Express → Framework principal del servidor
    MySQL + Sequelize → ORM y base de datos relacional
    JWT + bcrypt → Seguridad y manejo de contraseñas
    Thunder Client / Postman → Pruebas de endpoints
    VS Code → Entorno de desarrollo

⚙️ Instalación y Ejecución
    1️⃣ Instalar dependencias 
        npm install

    2️⃣ Iniciar servidor
        npm run dev
    *Espera a que inicie

    3️⃣ Cargar datos iniciales
        node seeders/seed.js


Servidor activo en http://localhost:4000

    🔑 Autenticación

        Todas las rutas protegidas requieren un JWT válido en el encabezado:

            Authorization: Bearer <token>

    🧭 Endpoints Disponibles
        Rutas Públicas (no requieren autenticación)
            Método      Ruta    	                Descripción
            GET	        /api/horarios	            Lista los horarios de clases
            GET	/api/tipoMembresia?rol=Estudiante	Devuelve las membresías según el rol

        Rutas Protegidas (requieren JWT válido)
            Método	    Ruta	                    Descripción
            POST	    /api/auth/login	            Inicia sesión y genera un token JWT
            GET	        /api/sesiones	            Lista todas las sesiones creadas
            POST        /api/sesiones	            Crea una nueva sesión (solo Admin o Entrenador)
            POST	    /api/pagos	                Registra un pago de membresía
            POST	    /api/asistencias	        Registra la asistencia de un usuario a una sesión
🧩 Ejemplos de Uso
    🔐 POST /api/auth/login
    Inicia sesión y obtiene el token JWT.
    Body:

        {
        "correo_electronico": "X@gym.com",
        "password": "123"
        }

    Respuesta:
        {
        "message": "Login exitoso",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
        "user": {
            "id": 1,
            "nombre": "X",
            "correo_electronico": "X@gym.com",
            "rol": "Admin"
        }
        }

    🌤️ GET /api/horarios

        Obtiene todos los horarios disponibles.

        Respuesta:

            [
            {
                "id": 1,
                "descripcion": "Lunes - Mañana (10:00 a.m. - 2:00 p.m.)"
                ...
            }
            ]

    🧾 GET /api/tipoMembresia?rol=Estudiante

        Devuelve las membresías según el rol especificado.

        Ejemplo:

            GET /api/tipoMembresia?rol=Estudiante

        Respuesta:

            [
            {
                "id": 1,
                "tiempo": 1,
                "valor": 9700.00,
                "id_rol": 2
            }
            ]

    🧑‍🏫 POST /api/sesiones
        Crea una nueva sesión de clase.
        Body:

            {
            "id_entrenador": 1,
            "id_horario_plantilla": 4
            }
        Respuesta:

            {
            "message": "Sesión creada",
            "sesion": {
                "id": 2,
                "id_entrenador": 1,
                "id_horario_plantilla": 4
            }
            }

    📋 GET /api/sesiones
        Lista todas las sesiones creadas.
        Respuesta:
        [
        {
            "id": 1,
            "id_entrenador": 1,
            "id_horario_plantilla": 3
        }
        ]
    💳 POST /api/pagos
        Registra un pago de membresía.

        Body:

            {
            "id_usuario": 2,
            "id_pago": 1
            }
        Respuesta:

            {
            "message": "Pago registrado",
            "pago": {
                "id_usuario": 2,
                "id_pago": 1
            }
            }

    🕒 POST /api/asistencias
        Registra la asistencia de un usuario a una sesión.

        Body:
            {
            "id_usuario": 3,
            "id_sesion": 1
            }

        Respuesta:
            {
            "message": "Asistencia registrada",
            "asistencia": {
                "id_usuario": 3,
                "id_sesion": 1
            }
            }
🧪 Pruebas Rápidas
    Generar token de prueba
    node testToken.js
    Copia el token generado sin saltos de línea.
    En Thunder Client o Postman:
    Authorization: Bearer <tu_token>