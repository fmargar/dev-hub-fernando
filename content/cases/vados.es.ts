import type { CaseStudy } from "../types";

export const vadosEs: CaseStudy = {
  slug: "sistema-vados-marbella",
  order: 1,
  featured: true,
  title: "Sistema de gestión de vados",
  tagline:
    "Unificar en una sola base de datos los expedientes de vados de cuatro zonas del término municipal de Marbella.",
  client: "Excmo. Ayuntamiento de Marbella",
  period: "Feb – May 2026",
  year: "2026",
  role: "Desarrollador full stack (prácticas), en pareja",
  summary:
    "El Ayuntamiento tenía los expedientes de vados repartidos en ficheros heredados de dos sistemas distintos, con codificaciones y formatos que ya nadie mantenía. Construimos la aplicación que los centraliza: importadores que normalizan los datos históricos, control de acceso por zona, auditoría automática de cada cambio y un mapa con los vados geolocalizados.",
  stack: [
    "Laravel 12",
    "PHP 8.2",
    "React 18",
    "Inertia.js",
    "PostgreSQL",
    "Eloquent ORM",
    "Leaflet",
    "Tailwind CSS",
    "Vite 7",
  ],
  metrics: [
    { value: "4", label: "zonas administrativas unificadas" },
    { value: "2", label: "formatos legacy importados" },
    { value: "5", label: "roles con alcance territorial" },
    { value: "20", label: "migraciones de esquema" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Contexto",
      body: [
        "El término municipal de Marbella se gestiona en cuatro zonas administrativas —Marbella centro, San Pedro de Alcántara, Nueva Andalucía y Las Chapas— y cada una guardaba sus propios expedientes de vados, con su propio personal técnico asignado.",
        "El problema no era construir un CRUD. Era que la información de partida venía de **dos sistemas heredados que no se hablaban entre sí**: los expedientes de Marbella estaban en un fichero TSV y los de San Pedro en un volcado dBASE de ancho fijo, ambos con codificación IBM850. Nadie podía cruzar datos entre zonas, ni saber si un vado seguía activo, ni quién había tocado un expediente por última vez.",
      ],
    },
    {
      id: "reto",
      heading: "El reto",
      body: [
        "El encargo tenía tres restricciones que condicionaron todo el diseño:",
      ],
      bullets: [
        {
          term: "Nada se borra",
          text: "En administración pública un expediente tiene valor documental. La baja de un vado es un acto administrativo, no una supresión de la fila.",
        },
        {
          term: "Cada técnico escribe solo en su zona",
          text: "Pero necesita poder consultar las demás: un vado de Nueva Andalucía puede afectar a una calle de Marbella centro.",
        },
        {
          term: "Trazabilidad completa",
          text: "Hay que poder responder quién cambió qué, cuándo y desde qué equipo. Sin depender de que el usuario se acuerde de registrarlo.",
        },
      ],
    },
    {
      id: "arquitectura",
      heading: "Arquitectura",
      body: [
        "Elegimos **Laravel 12 con Inertia.js** en lugar de una API REST con una SPA separada. Para una aplicación de intranet con un único cliente, montar y versionar una API aparte añadía trabajo sin aportar nada: Inertia deja escribir controladores Laravel normales y devolver componentes React, con navegación SPA y sin duplicar la capa de validación en el cliente.",
        "La persistencia es PostgreSQL con Eloquent. El frontend son componentes React 18 servidos por Vite, con Tailwind y Headless UI.",
      ],
      figure: {
        key: "vados-flow",
        caption: "Recorrido de una petición: la autorización y la auditoría son automáticas, no dependen del controlador.",
      },
    },
    {
      id: "decisiones",
      heading: "Decisiones técnicas",
      body: [
        "Tres decisiones concentran casi todo el valor del proyecto, y las tres consisten en mover una regla de negocio a un sitio donde no se pueda olvidar.",
      ],
      bullets: [
        {
          term: "El borrado se bloquea en el código, no en la interfaz",
          text: "`VadoPolicy::delete()` devuelve `false` siempre. No hay ruta ni botón de borrado. Dar de baja un vado es asignarle una `fecha_baja`, y el estado activo/inactivo se calcula a partir de ese campo. Esconder el botón habría bastado para la demo; bloquearlo en la policy es lo que hace que la regla siga viva cuando alguien añada una pantalla nueva dentro de dos años.",
        },
        {
          term: "El filtro territorial es un Global Scope, no un `where` en cada consulta",
          text: "`TerritorioScope` se aplica al modelo y filtra por el municipio del usuario en todas las consultas de la sesión. Se desactiva en consola, porque los importadores y los seeders necesitan escribir en todas las zonas. Si el filtro viviera en cada controlador, bastaría con olvidarlo una vez para filtrar datos de otra zona.",
        },
        {
          term: "La auditoría es un Observer, no una llamada explícita",
          text: "`VadoObserver` registra alta, modificación y baja administrativa sin que el controlador haga nada. Guarda el usuario, su DNI, el nombre del equipo desde el que se hizo el cambio (resuelto por PTR) y un JSON con los valores `old` y `new`. Nadie puede saltarse el registro escribiendo por otro camino.",
        },
      ],
    },
    {
      id: "roles",
      heading: "Permisos: lectura global, escritura territorial",
      body: [
        "El sistema tiene cinco roles: un superadministrador y un administrador por zona. La asimetría es lo interesante: **todos pueden leer todo, pero cada uno solo escribe en lo suyo**.",
        "Eso resuelve el caso real —un técnico necesita consultar el vado de la calle de al lado aunque pertenezca a otra zona— sin abrir la puerta a que lo modifique. El municipio de un usuario nuevo no se elige a mano: se deriva de su rol mediante un mapeo en el modelo `User`, así que no puede quedar incoherente.",
      ],
      figure: {
        key: "vados-roles",
        caption: "Matriz de permisos: la restricción territorial solo aplica a la escritura.",
      },
    },
    {
      id: "importacion",
      heading: "Importar 30 años de expedientes en papel digitalizado",
      body: [
        "La parte más laboriosa fue traer los históricos. Son dos comandos de consola distintos porque los ficheros no se parecen en nada.",
      ],
      bullets: [
        {
          term: "Marbella (TSV, IBM850)",
          text: "Lectura línea a línea, conversión de cada campo de IBM850 a UTF-8 y limpieza de caracteres que arrastraban los sistemas antiguos (`¥` por `Ñ`, `§` por `º`).",
        },
        {
          term: "San Pedro (dBASE de ancho fijo)",
          text: "Extracción por posiciones exactas en bytes —`NUMERO(7)`, `NOMBRE(37)`, `DNI(8)`, `DOMICILIO(41)`…—, concatenación de las cinco columnas de observaciones y limpieza de fechas basura del volcado original (patrones como `03/01/-1`).",
        },
        {
          term: "Columna espejo de direcciones",
          text: "Las direcciones venían abreviadas de forma inconsistente. El importador genera una versión normalizada expandiendo abreviaturas (`C/` → `CALLE`, `AVDA.` → `AVENIDA`, `CDAD. PROP.` → `COMUNIDAD DE PROPIETARIOS`) y conserva la original. Buscar por dirección deja de depender de cómo la escribiera el funcionario de turno.",
        },
        {
          term: "Un vado físico, varios titulares",
          text: "Antes de crear un registro, el importador busca si ese vado ya existe por `num_placa + municipio + ubicación`. Si existe, reutiliza el identificador y engancha el titular al vado que ya estaba. Así el histórico de propietarios queda como una relación 1:N en vez de como filas duplicadas.",
        },
      ],
    },
    {
      id: "mapa",
      heading: "Geolocalización",
      body: [
        "El mapa usa Leaflet con react-leaflet y muestra todos los vados que tienen coordenadas. El autocompletado de direcciones conecta con **CartoCiudad**, el servicio público de geocodificación del Gobierno de España: el técnico escribe la dirección, elige una sugerencia y las coordenadas se rellenan solas. También se puede afinar la posición pinchando directamente en el mapa.",
      ],
    },
    {
      id: "resultado",
      heading: "Resultado",
      body: [
        "Al terminar las prácticas el sistema cubría el ciclo completo: importación de los históricos de las dos zonas con datos, alta y edición de expedientes con control territorial, ficha detallada, histórico de titulares, mapa geolocalizado, gestión de usuarios y consulta de auditoría.",
        "Entregamos además una memoria técnica de 23 secciones con el modelo de datos, el manual de despliegue y los indicadores operativos sugeridos para el seguimiento del sistema.",
      ],
    },
    {
      id: "pendiente",
      heading: "Qué quedó pendiente",
      body: [
        "La autenticación funciona con DNI y contraseña contra la tabla de usuarios local, y está validada con cuentas de prueba. **La validación contra el directorio activo de la intranet municipal quedó pendiente**: durante el período de prácticas no llegaron a facilitarnos cuentas reales para probarla.",
        "En la memoria dejamos documentados los dos escenarios de puesta en producción: dar de alta a los empleados dentro de la aplicación, que no requiere tocar código, o integrar LDAP/Active Directory para inicio de sesión único, que sí lo requiere. Para el segundo dejamos identificados los ficheros a modificar, el paquete a instalar y una estimación de entre dos y cuatro jornadas.",
        "Prefiero contarlo así a decir que el sistema \"integra LDAP\", porque no es lo que hicimos.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Desarrollado para el Ayuntamiento de Marbella; el repositorio no es público.",
  },
};
