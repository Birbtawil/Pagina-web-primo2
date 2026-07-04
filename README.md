# CG Premier Builders — Landing Page (Deep Premium redesign)

Landing page estática (HTML + Tailwind CSS + JS ligero, sin frameworks ni backend).

## Estructura

```
index.html          Marcado semántico de toda la página (una sola vista)
src/input.css        Fuente de Tailwind (directivas + componentes custom)
dist/output.css      CSS compilado — NO editar a mano, se regenera con el build
tailwind.config.js    Paleta, tipografía, sombras y animaciones de marca
js/main.js            Header con scroll, menú móvil, scroll-reveal, parallax,
                       selects de fecha/hora y validación del formulario
assets/img/           Imágenes de servicios y hero (ver nota abajo)
```

## Build

```bash
npm install
npm run build   # compila dist/output.css (minificado)
npm run watch   # recompila en caliente mientras editas src/input.css
```

Después de tocar clases de Tailwind en `index.html` o `src/input.css`, hay
que volver a correr `npm run build` para que `dist/output.css` quede al día.

## Imágenes

Los 5 archivos en `assets/img/` son fotos reales del cliente:

- `image_573feb.png` — textura de tejas asfálticas (fondo del hero)
- `image_574023.png` — instalación de canaletas
- `image_574046.png` — techo azul en construcción (tarjeta destacada)
- `image_57407f.png` — trabajador en techo de madera
- `image_57409f.png` — techo metálico rojo

Para reemplazar cualquiera por una versión nueva, basta con sobrescribir el
archivo manteniendo el mismo nombre — el HTML y el CSS no necesitan cambios.

## Formulario de cotización

El formulario (`#quote-form` en `index.html`, lógica en `js/main.js`) valida
en cliente y muestra una confirmación local. No hay backend conectado: el
`div[data-endpoint]` en el HTML está vacío a propósito. Para conectarlo a un
servicio real (API propia, Formspree, Zapier, etc.), añade la URL en ese
atributo — el `fetch()` en `main.js` ya está preparado para usarla.
