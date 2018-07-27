api>

<!-- Bloque 1 -->
apiBlock>
# Todo



apiBlock>
## GET /todos

Devuelve un listado con todas las tareas.

```apiExample
{
  "url": "http://airzoneservice.airzonesl.es:3080/api/v1/customers/enums",
  "method": "GET",
  "params": []
}
```


<!-- Bloque 2 -->
apiBlock>

## GET /todos/{Id}

Devuelve todos los datos de una tarea mediante su `:id`.

```apiExample
{
  "url": "http://jsonplaceholder.typicode.com/todos",
  "method": "GET",
  "params": [
    {
      "name": "id",
      "required": true,
      "type": "number",
      "description": "Id de la tarea",
      "default": null    
    }
  ]
}
```


<!-- Bloque 3 -->
apiBlock>

## POST /todos

apiUrl[GET](http://airzoneservice.airzonesl.es:3080/api/v1/customers/enums)

Este es un texto de ejemplo:

| field    | Type | Descripción                                                  |
| -------- | --- |  ------------------------------------------------------------ |
| `brand`  | `Integer` | Listado con los colores incluidos en el `$color-brand-map`.  |
| `gray`   | `Integer` | Listado con los colores incluidos en el `$color-gray-map`.   |
| `notify` | `String` | Listado con los colores incluidos en el `$color-notify-map`. |


```apiCode[html](Example Request)
<p>hola mundo</p>
<p>hola mundo</p>
<p>hola mundo</p>
```

```apiCode[json](Example Response)
{
  'key1': 'value1'
  key2: 3
}
```

apiBlock>
## GET /todos/{Id}

Devuelve todos los datos de una tarea.

```apiExample
{
  "url": "http://jsonplaceholder.typicode.com/todos",
  "method": "GET",
  "params": [
    {
      "name": "id",
      "required": true,
      "type": "number",
      "description": "Id de la tarea",
      "default": null    
    },
    {
      "name": "userId",
      "required": false,
      "type": "number",
      "description": "Id del usuario",
      "default": null    
    }
  ]
}
```

apiBlock>
## PATCH /todos/{Id}

Devuelve un listado con todas las tareas.

```apiExample
{
  "url": "http://jsonplaceholder.typicode.com/todos",
  "method": "GET",
  "params": []
}
```

apiBlock>
## DELETE /todos/{Id}

Devuelve un listado con todas las tareas.

```apiExample
{
  "url": "http://jsonplaceholder.typicode.com/todos",
  "method": "GET",
  "params": []
}
```
