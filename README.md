# Generador de documentación
Didor docs es un generador de documentación online. Utiliza [docsify](https://docsify.js.org/) como base, y se han creado algunos plugins para añadirle características y funcionalidades nuevas.

## Links
* [Documentación](https://github.com/fvena/didor-docs)

## Características
* Preocúpate solo de los contenidos, solo archivos .md
* Sencillo y rápido de utilizar.
* Documenta tu API con ejemplos en vivo.
* Documenta tu guía de estilos.
* Visualiza tu documentación con actualización en vivo mientras desarrollas.
* Visualiza tu documentación en tu repositorio desde cualquier sitio web.

## Visualizar tu documentación durante el desarrollo
**Didor-docs** incluye un servidor para poder visualizar tu documentación en local
mientras desarrollas, con actualización en vivo. No es recomendable utilizarlo
para mostrar tu documentación en producción.

El primer paso es instalar `didor-docs` como dependencia en tu proyecto.

```bash
$ npm install didor-docs --save-dev
```

En nuestro archivo `package.json` añadimos el siguiente script.

```json
"scripts": {
  "docs": "didor-docs /docs",
}
```

Siendo `/docs` la ruta del directorio donde tendremos nuestra documentación.

Aparte de la ruta, también puedes configurar los siguientes parámetros:

```bash
didor-docs /docs -o         # Abre la documentación en tu navegador por defecto (default: false)
didor-docs /docs -p 3000    # Indica el puerto donde se mostrará tu documentación (default: 3000)
didor-docs /docs -l 35729   # Indica el puerto liveReload (default: 35729)
```

## Ejemplos

### Proyecto simple
Necesitas al menos dos archivos para comenzar a documentar:

```
docs/		        # Directorio donde están tu documentación
|_ home.md	    # Página de inicio de tu documentación
|_ _sidebar.md	# Links mostrados en la barra lateral
```

## Licencia
Este proyecto se distribuye bajo una licencia MIT.
