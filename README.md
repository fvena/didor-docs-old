# Generador de documentación
Didor docs es un generador de documentación online. Utiliza [docsify](https://docsify.js.org/) como base, y se han creado algunos plugins para añadirle características y funcionalidades nuevas.

## Inicio rápido
Primero, instalar los módulos que necesita el proyecto.
```bash
$ npm install
```

Ahora, podemos empezar a desarrollar.
```bash
$ npm run dev
```

Finalmente cuando el desarrollo esté terminado, lo exportaremos para producción.
```bash
$ npm run build
```

¡Es todo!. Los archivos están listos para subirlos a producción en la carpeta `dist\`.

## ¿Como está desarrollado este proyecto?

### Directorios
Hay cuatro directorios principales en el proyecto
:
```
build/		# Configuración de Webpack
config/		# Configuración para Desarrollo y Producción
src/ 		  # Archivos del proyecto
|_ scripts/	# Archivos Javascript
|_ styles/	# Archivos estilos (scss)
|_ views/	# Archivos con las Plantillas HTML (pug)
static/		# Archivos estáticos (Como fuentes, imágenes)
```

### Frameworks utilizados
- Babel.js para utilizar ES6
- Sass para CSS
- Pug para las plantillas HTML

También soporta **hot reload** y **eslint**

## Licencia
Este proyecto se distribuye bajo una licencia MIT.
