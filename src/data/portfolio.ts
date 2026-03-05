export const personalInfo = {
  name: "Marcos Burdaspar",
  title: "Ingeniero Informático | Desarrollador Full Stack | Analista de Datos",
  email: "burdasparmarcos@gmail.com",
  linkedin: "https://www.linkedin.com/in/marcos-burdaspar-celada-91a660155",
  github: "https://github.com/burdas",
  available: true
};

export const experience = [
  {
    slug: "540",
    role: "Software Engineer",
    company: "540",
    period: "2024 - Actualidad",
    description: "Consultoría de Software de Calidad. Especialización en relaciones sostenibles y longevas con clientes, priorizando la excelencia técnica.",
    highlights: [
      "Clean Code, Arquitecturas Limpias, Mentalidad Lean",
      "Testing avanzadas y estrategias de Testing",
      "Proyecto Ecommerce: PHP + MySQL con Arquitectura Hexagonal y Bounded Contexts",
      "Integración de herramientas de IA (Claude Code) para optimizar flujos de trabajo",
      "Metodologías Extreme Programming (XP)",
      "Colaboración en equipos técnicos exigentes"
    ]
  },
  {
    slug: "exkal",
    role: "Responsable de analítica de datos",
    company: "Exkal",
    period: "2021 - 2024",
    description: "Generación de informes y análisis de datos para múltiples departamentos.",
    highlights: [
      "SQL Server - Creación de informes y consultas avanzadas",
      "QLIK - Reporting, ETL y Data Warehouse",
      "QLIK Nprinting - Diseño y distribución de informes clave",
      "Análisis Multidepartamental",
      "Grafana - Visualización de datos en tiempo real",
      "Migración ERP a SAP - Procesamiento y análisis de datos"
    ]
  },
  {
    slug: "dynamobel",
    role: "Prácticas / Auxiliar informático",
    company: "Dynamobel",
    period: "2018 - 2020",
    description: "Desarrollo de aplicaciones internas para necesidades de la empresa.",
    highlights: [
      "Visual Basic - Desarrollo de aplicaciones de escritorio",
      "Windows CE - Desarrollo de aplicaciones para dispositivos móviles",
      "SQL Server - Creación de consultas, Tablas, Procedimientos y Funciones",
      "Integración con ERP Navisión",
      "Business Intelligence con Reporting Services (SSRS)"
    ]
  }
];

export const education = [
  {
    degree: "Grado en Ingeniería Informática",
    institution: "Universidad Pública de Navarra",
    period: "2020 - 2025",
    details: "Mención en Ingeniería de Software. TFG: Desarrollo de casos de uso en tecnología Blockchain (Calificación: 9)"
  },
  {
    degree: "Full Stack Open",
    institution: "Universidad de Helsinki",
    period: "Actualmente",
    details: "Máster gratuito sobre desarrollo full stack"
  }
];

export const projects = [
  {
    slug: "portfolio",
    name: "Portfolio",
    url: undefined,
    repo: "https://github.com/burdas/portfolio",
    description: "Mi portfolio personal desarrollado con Astro",
    fullDescription: "Portfolio personal desarrollado con Astro, TypeScript y Tailwind CSS. Muestra mi experiencia, proyectos, habilidades y formación de manera profesional.",
    tech: ["Astro", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
    features: ["Diseño responsive", "Modo oscuro", "Proyectos dinámicos", "Optimización SEO", "Animaciones suaves"],
    image: "portfolio.webp"
  },
  {
    slug: "dario-nutricion",
    name: "Dario Nutrición",
    url: "https://darionutricion.com/",
    repo: undefined,
    description: "Página web para un nutricionista. Optimización SEO.",
    fullDescription: "Página web diseñada para un nutricionista. Sitio web para promocionar el servicio de nutrición con diferentes servicios ofrecidos. Optimización de SEO para su posicionamiento.",
    tech: ["HTML", "CSS", "JavaScript", "Astro", "Tailwind CSS", "TypeScript"],
    features: ["Landing page", "Sección de servicios", "Optimización SEO", "Diseño responsive"],
    image: "dario_nutricion.webp"
  },
  {
    slug: "taxi-peralta",
    name: "Taxi Peralta",
    url: "https://www.taxiperalta.com/",
    repo: "https://github.com/burdas/taxiperalta",
    description: "Página web para profesional del taxi. Optimización SEO.",
    fullDescription: "Taxi Peralta es un proyecto web completo desarrollado para un profesional del taxi. El sitio web cuenta con una calculadora de viajes que permite a los clientes estimar el coste de sus trayectos, un panel de administración para gestionar tarifas y un sistema de contacto eficiente.",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL", "Bootstrap", "Google Maps API"],
    features: ["Calculadora de viajes", "Admin panel", "Tarifas", "Formulario de contacto", "Optimización SEO"],
    image: "taxiperalta.webp"
  },
  {
    slug: "la-septima-gema",
    name: "La Séptima Gema",
    url: "https://taxiperalta.com/LaSeptimaGema",
    repo: "https://github.com/burdas/La7aGema",
    description: "Proyecto web clon de IMDB. Sistema de login y valoración de películas.",
    fullDescription: "La Séptima Gema es una aplicación web que replica la funcionalidad de IMDB, permitiendo a los usuarios buscar películas, ver información detallada y valorar películas con un sistema de 5 estrellas.",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL", "Bootstrap", "TMDB API"],
    features: ["Buscador de películas", "Top 20", "Valoración 5 estrellas", "Sistema de login", "Detalles de películas"],
    image: "la_septima_gema.webp"
  },
  {
    slug: "nutricalc",
    name: "Nutricalc",
    url: "https://taxiperalta.com/NutriCalc/",
    repo: "https://github.com/burdas/NutriCalc",
    description: "Calculadora de calorías y macronutrientes.",
    fullDescription: "NutriCalc es una aplicación web que permite a los usuarios calcular sus necesidades calóricas diarias y los macronutrientes necesarios según sus objetivos.",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "Chart.js"],
    features: ["Cálculo de calorías", "Macronutrientes", "Gráficos con Chart.js", "Configuración de parámetros"],
    image: "nutricalc.webp"
  },
  {
    slug: "facturando",
    name: "Facturando",
    repo: "https://github.com/burdas/Facturando",
    description: "Aplicación de escritorio para facturación de taxis y generación de PDFs.",
    fullDescription: "Aplicación de escritorio desarrollada en C# con Windows Forms que permite gestionar facturación de forma eficiente.",
    tech: ["C#", "Visual Studio", "Windows Forms", ".NET"],
    features: ["Gestión de clientes", "Generación de PDF corporativo", "Autocompletado", "Historial de facturas"],
    image: "facturando.webp"
  },
  {
    slug: "tfg-blockchain",
    name: "TFG - Blockchain",
    url: "https://academica-e.unavarra.es/handle/2454/38436",
    repo: "https://github.com/burdas/TFG",
    description: "Investigación y desarrollo de casos de uso sobre blockchain (Ethereum).",
    fullDescription: "Trabajo de Fin de Grado sobre tecnología Blockchain centrado en Ethereum. Se desarrollaron tres casos de uso prácticos.",
    tech: ["Ethereum", "Solidity", "VS Code", "HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
    features: ["Clon de Twitter descentralizado", "Diario descentralizado", "Juego 3 en raya", "Smart Contracts"],
    image: "tfg_ethereum.webp"
  },
  {
    slug: "pipero",
    name: "Pipero",
    url: "https://taxiperalta.com/pipero",
    repo: "https://github.com/burdas/pipero",
    description: "Aplicación para gestión de un local (ERP miniatura).",
    fullDescription: "Pipero es un ERP en miniatura desarrollado para gestionar un local de restauración.",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "SQLite", "Bootstrap"],
    features: ["Gestión de usuarios/roles", "Mensualidades", "Stock", "Bote", "Dashboard"],
    image: "pipero.webp"
  },
  {
    slug: "burdaspong",
    name: "BurdasPong",
    url: "https://taxiperalta.com/burdaspong",
    repo: "https://github.com/burdas/BurdasPong",
    description: "Minijuego clon de Pong.",
    fullDescription: "BurdasPong es un juego clásico de Pong desarrollado con HTML5 Canvas y JavaScript.",
    tech: ["HTML", "JavaScript", "Canvas API"],
    features: ["Motor gráfico Canvas", "IA adversario", "Controles intuitivos", "Sistema de puntuación"],
    image: "burdaspong.webp"
  },
  {
    slug: "recuperalo",
    name: "Recupéralo",
    repo: "https://github.com/burdas/recuperalo",
    description: "App Android para objetos perdidos.",
    fullDescription: "Aplicación móvil Android que permite reportar objetos perdidos y encontrados.",
    tech: ["Android Studio", "Java", "Open Street Map", "MongoDB", "Firebase"],
    features: ["Login Google", "Búsqueda en mapa", "Chat integrado", "Notificaciones"],
    image: "recuperalo.webp"
  },
  {
    slug: "superpoke",
    name: "Superpoke",
    repo: "https://github.com/kryword/superpoke",
    description: "Pokédex utilizando PokéAPI.",
    fullDescription: "Aplicación web que funciona como Pokédex, permitiendo buscar Pokémon y ver sus características.",
    tech: ["HTML", "CSS", "JavaScript", "React", "Material UI", "PokéAPI"],
    features: ["Buscador", "Ficha técnica", "Listado por generaciones", "Detalles de estadísticas"],
    image: "pokeno.webp"
  }
];

export const skills = [
  "PHP", "MySQL", "SQL Server", "JavaScript", "TypeScript", "React", "Astro",
  "HTML/CSS", "Bootstrap", "jQuery", "Clean Code", "Arquitectura Hexagonal",
  "SQL", "ETL", "Data Warehouse", "QLIK", "Grafana", "SAP",
  "Visual Basic", "C#", ".NET", "Android Studio", "Solidity", "Blockchain",
  "Git", "CI/CD", "DevOps"
];
