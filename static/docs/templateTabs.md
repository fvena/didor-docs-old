# Tabs

Este plugin genera un menú de navegación por pestañas que permite cambiar entre
diferentes bloques de código y un [demo](templateDemo.md).


<div class="blockExample">
```demo
<h1 class='color-brand'>Hola Mundo</h1>
```

```demo[html]
<h1>Hola Mundo</h1>
```

```demo[scss]
h1 { color: brand(); }
```

```demo[js]
console.log('Hola Mundo')
```
</div>


## Utilización

Todos los bloques (demo y códigos) se engloban dentro de un `div` con la clase
`.blockExample`. Cada bloque de código necesita que le añadamos `demo[language`]
para poder generar las pestañas, siendo `language` el lenguaje del bloque de código.

?> Los bloques de código no afectarán a la demo.

?> El código utilizado en la demo, no se mostrará en una tab. Esto permite poder
utilizar un código más complejo para la demo, y uno más simple para representar
el código utilizado.

```demo[markdown]
<div class="blockExample">
  ```demo
  <h1 class="color-brand">Hola Mundo</h1>
  ```

  ```demo[html]
  <h1>Hola Mundo</h1>
  ```

  ```demo[scss]
  h1 { color: brand(); }
  ```

  ```demo[js]
  console.log('Hola Mundo')
  ```
</div>
```
