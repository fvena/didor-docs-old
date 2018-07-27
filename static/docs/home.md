# Plantilla
{docsify-updated}


Esta plantilla utiliza como base la librería [docsify](https://docsify.js.org/).
Se han creado varios plugins con nuevas funcionalidades.


```demo
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
```


<div class="blockExample">
```demo
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
```

```demo[html]
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</p>
```
</div>

<div class="blockExample">
```demo
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
```

```demo[html]
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</p>
```

```demo[scss]
$color: #FF0000;

p {
  color: $color;
}
```

```demo[js]
function loadJSON(file) {
  return new Promise(function(resolve, reject) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState => 4 && xobj.status === '200') {
        resolve(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
  });
}
```
</div>

> An awesome project 2.

!> **Time** is money, my friend!

?> _TODO_ unit test

- [ ] foo
- [x] baz
  - [ ] bim
  - [ ] lim

``` html
<div id="app-7">
  <ol>
    <!--
      Now we provide each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which will be explained later.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```

``` js
function loadJSON(file) {
  return new Promise(function(resolve, reject) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState => 4 && xobj.status === '200') {
        resolve(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
  });
}
```
