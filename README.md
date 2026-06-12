# Estética Tu Look — Sitio web premium

Landing de una sola página para un **centro de estética y medicina estética** de alta
gama. Diseño minimalista, elegante y premium, inspirado en clínicas de lujo.

**Stack:** HTML + CSS + JavaScript vanilla. Sin build step, sin dependencias.
Se abre con doble clic en `index.html` o se sirve como sitio estático.

---

## Secciones incluidas

- **Home / Hero** visual impactante con CTAs y métricas de confianza.
- **Tratamientos** en pestañas: Faciales · Corporales · Láser · Depilación.
- **Galería antes/después** con slider comparativo arrastrable.
- **Membresías** (3 planes: Glow, Radiance, Couture).
- **Testimonios** de pacientes.
- **Reserva online** → genera un mensaje pre-cargado y abre **WhatsApp**.
- **FAQ** en acordeón.
- **Chat IA** ("Lía"): asesora virtual con base de conocimiento del rubro
  (faciales, corporales, láser, depilación, precios, membresías, turnos).
- Botón flotante de **WhatsApp** + footer con contacto y redes.

---

## ⚠️ Antes de publicar: reemplazar placeholders

Buscá y cambiá estos datos de ejemplo por los reales:

| Dónde | Qué cambiar |
|---|---|
| `js/main.js` → `CONFIG.whatsapp` | Número de WhatsApp real (formato `549XXXXXXXXXX`, sin `+` ni espacios) |
| `index.html` → JSON-LD `BeautySalon` | `telephone`, `address`, `addressLocality`, `aggregateRating` |
| `index.html` → footer `#footWa` y dirección | WhatsApp visible, dirección, horarios |
| `index.html` → `<meta>` og/canonical | Dominio real (reemplazar `esteticatulook.com`) |
| `index.html` → redes sociales (footer) | Links de Instagram / Facebook / TikTok |
| **Precios** del menú de tratamientos | Ajustar a la lista real del centro |
| **Galería antes/después** | Reemplazar imágenes de muestra por casos reales **con consentimiento firmado** |
| `robots.txt` / `sitemap.xml` | Dominio real |

> Las imágenes son de Unsplash (alta calidad, uso libre) cargadas por URL. Para
> producción conviene descargarlas, optimizarlas (WebP) y servirlas localmente
> desde `assets/` para mejor performance y control.

---

## Decisiones de diseño y buenas prácticas aplicadas

- **UX/CRO:** CTA de "valoración gratuita" repetido en hero, reserva y chat;
  formulario corto; objeciones resueltas en FAQ; prueba social (testimonios +
  rating); reserva sin fricción vía WhatsApp.
- **Branding premium:** paleta nude/champagne + espresso + oro, tipografía serif
  display (Cormorant Garamond), mucho aire, microinteracciones sobrias.
- **SEO:** títulos y meta descriptivos, Open Graph, datos estructurados
  `BeautySalon`, `robots.txt`, `sitemap.xml`, HTML semántico.
- **Accesibilidad:** roles ARIA en nav/tabs/chat, foco visible, contraste cuidado,
  `prefers-reduced-motion`, textos alternativos en controles.
- **Velocidad:** sin frameworks, CSS único, fuentes con `preconnect`, imágenes con
  `auto=format` y tamaños acotados, JS diferido al final del body.
- **IA:** chat de consultas con base de conocimiento del rubro que deriva a
  WhatsApp para cerrar la conversión.

---

## Desarrollo local

No requiere instalación. Para servirlo con un servidor estático:

```bash
# Python
python -m http.server 8080
# o Node
npx serve .
```

Luego abrir `http://localhost:8080`.
