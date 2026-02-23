# Portfolio de Marcos Burdaspar

Portfolio personal construido con Astro, Three.js y Tailwind CSS.

## 🚀 Tecnologías

- **Astro** - Framework web moderno
- **Tailwind CSS v4** - Estilos
- **Three.js** - Gráficos 3D en el Hero
- **GSAP** - Animaciones
- **astro-icon** - Iconos

## 🛠️ Comandos

| Comando           | Acción                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Instala dependencias                             |
| `npm run dev`     | Inicia servidor local en `localhost:4321`       |
| `npm run build`   | Compila para producción en `./dist/`            |
| `npm run preview` | Previsualiza el build antes de desplegar        |

## 📁 Estructura

```
src/
├── assets/          # Imágenes y recursos
├── components/      # Componentes Astro
│   ├── About.astro
│   ├── Career.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   ├── Hero3D.astro
│   ├── Navbar.astro
│   ├── NoiseBackground.astro
│   ├── Projects.astro
│   └── Scene3D.astro
├── layouts/         # Layouts
├── pages/           # Páginas
│   ├── index.astro
│   ├── experience/[slug].astro
│   └── projects/[slug].astro
├── scripts/         # Scripts TypeScript
└── styles/          # Estilos globales
```

## 🎨 Secciones

- **Hero** - Sección 3D con Three.js y noise background
- **About** - Información personal y stack tecnológico
- **Career** - Experiencia profesional
- **Projects** - Proyectos destacados
- **Contact** - Información de contacto

## 📝 Licencia

MIT
