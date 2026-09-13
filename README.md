# HGW Distribuidores - Catálogo Web

Página web profesional para distribuidores de HGW con catálogo de productos descargable, diseñada para ser publicada en GitHub Pages.

## Características

- Diseño moderno y profesional
- Catálogo de productos visual
- Sección de descarga de catálogos (PDF, Excel, ZIP)
- Información de contacto
- Diseño responsive (móvil, tablet, desktop)
- Navegación suave entre secciones
- Optimizado para GitHub Pages

## Estructura del Proyecto

```
pagina-para-distribuidores/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── README.md           # Este archivo
└── 404.html           # Página de error (opcional)
```

## Instalación y Uso

### Para ver localmente:

1. Clone o descargue este repositorio
2. Abra `index.html` en su navegador web
3. O use un servidor local:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js (con http-server)
   npx http-server
   ```

### Para publicar en GitHub Pages:

1. **Crear un repositorio en GitHub:**
   - Vaya a github.com y cree un nuevo repositorio
   - Nombre sugerido: `hgw-distribuidores` o similar

2. **Subir los archivos:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - HGW Distribuidores page"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Vaya a Settings → Pages en su repositorio
   - En "Source", seleccione "Deploy from a branch"
   - Seleccione la rama "main" y la carpeta "/ (root)"
   - Haga clic en "Save"

4. **Acceder a su sitio:**
   - Espere unos minutos mientras GitHub despliega el sitio
   - Su sitio estará disponible en: `https://TU_USUARIO.github.io/TU_REPOSITORIO`

## Personalización

### Cambiar colores:
Edite `styles.css` y modifique las variables de color en las secciones correspondientes:
- Colores principales: `#1e3c72`, `#2a5298`
- Colores acento: `#ffd700`, `#28a745`

### Agregar productos:
En `index.html`, en la sección `<section id="catalogo">`, agregue más bloques `.product-card` con la información de sus productos.

### Configurar enlaces de descarga:
En la sección `<section id="descargar">`, reemplace los `href="#"` con las URLs reales de sus archivos:
```html
<a href="ruta/a/tu-catalogo.pdf" class="btn btn-download" download>Descargar PDF</a>
```

### Agregar imágenes de productos:
Reemplace los `div.placeholder-image` con etiquetas `<img>`:
```html
<img src="imagenes/producto1.jpg" alt="Nombre del producto">
```

## Soporte

Para preguntas o soporte, contacte a:
- Email: distribuidores@hgw.com
- Teléfono: +1 (555) 123-4567

## Licencia

© 2026 HGW Distribuidores. Todos los derechos reservados.