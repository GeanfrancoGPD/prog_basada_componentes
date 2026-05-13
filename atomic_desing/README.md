# Atomic Design — Proyecto de ejemplo (Vue 3 + Vite)

Este proyecto sigue la arquitectura de Atomic Design para organizar componentes reutilizables y escalables en **niveles**: átomos, moléculas, organismos, plantillas y páginas.

Estructura principal de componentes incluidos en el proyecto:

- Átomos:
  - Button.vue
  - Checkbox.vue
  - Input.vue
  - Label.vue

- Moléculas:
  - Card.vue
  - Searhbar.vue

- Organismos:
  - Footer.vue
  - Header.vue
  - ProductGrid.vue

- Páginas:
  - home.vue

- Templates:
  - HomeProduct.vue

Estado y notas de mejora:

- `HomeProduct.vue`: necesita rediseño y mejoras de funcionalidad (mejorar maquetado y flujo de datos).
- Faltan implementar: `sidebar` y `barProduct` (barra/controls del producto). Estos elementos deberían añadirse como organismos o templates según convenga.

Cómo ejecutar el proyecto (rápido):

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar servidor de desarrollo:

```bash
npm run dev
```
