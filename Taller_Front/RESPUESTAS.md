# Taller Angular — Respuestas Conceptuales

## 1. Sobre Observables y Asincronía

**a. ¿Por qué las peticiones HTTP en Angular devuelven un `Observable` en lugar de la data directa? ¿Qué diferencia hay frente a una `Promise`?**

Las peticiones HTTP en Angular devuelven un `Observable` porque la operación es **asíncrona**: la data no existe en el momento en que se invoca el método, sino que llegará en algún punto futuro a través de la red. Devolver un `Observable` permite que el código que hace la petición continúe ejecutándose sin bloquear el hilo principal, y notifica al suscriptor cuando la respuesta esté disponible.

Diferencias clave frente a una `Promise`:

| Aspecto | Observable | Promise |
|---|---|---|
| Ejecución | Lazy: no se dispara hasta que alguien hace `.subscribe()` | Eager: se ejecuta al crearse |
| Valores emitidos | Múltiples valores en el tiempo (stream) | Un único valor (o un único error) |
| Cancelación | Cancelable mediante `unsubscribe()` | No se puede cancelar |
| Operadores | Pipeline rico con RxJS (`map`, `filter`, `switchMap`, `retry`, `debounceTime`, etc.) | Limitado a `.then`, `.catch`, `.finally` |
| Reintentos | Triviales (`retry(n)`, `retryWhen`) | Requieren código manual |
| Composición | Combina fácilmente streams (`combineLatest`, `forkJoin`) | Combinación más rígida (`Promise.all`) |

En el contexto del taller, esto permite por ejemplo cancelar una petición pendiente a WeatherAPI si el usuario cambia rápidamente de ciudad, aplicar `map` para transformar la respuesta cruda en un `WeatherDetail` antes de que llegue al componente, y reaccionar a múltiples emisiones cuando una ciudad cambia varias veces (HU-03 con `ngOnChanges`).

---

## 2. Sobre el Patrón Maestro-Detalle

**b. ¿Por qué se usa `@Input()` para pasar la ciudad a `CityDetailComponent` en lugar de volver a hacer un `GET` a `/api/cities/{id}`?**

Porque la ciudad ya fue cargada por el componente padre (`CityListComponent`) cuando este obtuvo la lista completa con `GET /api/cities`. Hacer un segundo `GET /api/cities/{id}` sería:

1. **Innecesario:** el padre ya tiene el objeto `City` en memoria con su `country` anidado.
2. **Ineficiente:** duplica una llamada HTTP que añade latencia y carga al backend sin aportar información nueva.
3. **Inconsistente:** podría devolver datos distintos a los mostrados en la lista si el backend cambia entre las dos llamadas, rompiendo la UX (el usuario hace clic en "Bogotá" y ve el detalle de otra cosa).

Pasar la ciudad por `@Input()` mantiene una **única fuente de verdad** (la lista del maestro), reduce acoplamiento del detalle con la API, y permite que el detalle se concentre en lo que sí es exclusivo de su responsabilidad: consultar WeatherAPI y mostrar el historial. Es además el patrón natural de Angular para flujos maestro-detalle: el padre orquesta la selección, el hijo renderiza el ítem seleccionado.

**c. Observe que en la respuesta de `GET /api/cities`, el campo `country` ya viene como objeto anidado (no solo el `countryId`). ¿Qué ventaja de diseño tiene esta decisión del backend para el frontend?**

La principal ventaja es que **evita el problema N+1 en el frontend**. Si el backend devolviera solo `countryId`, el frontend tendría dos opciones malas:

1. Hacer una petición `GET /api/countries/{id}` por cada ciudad de la lista (N llamadas extra para mostrar N filas).
2. Hacer un `GET /api/countries` y construir manualmente un diccionario `id → Country` para resolver los nombres en el cliente.

Con el objeto anidado:

- **Renderizado directo**: `{{ city.country.name }}` funciona sin lógica de resolución adicional.
- **Una única petición** carga todo lo necesario para pintar la tabla maestro (HU-01).
- **Tipos más fuertes**: el modelo `City` declara `country: Country`, lo que permite a TypeScript validar accesos como `city.country.isoCode` en compilación.
- **Menos estado en el componente**: no hay que mantener un mapa auxiliar de países sincronizado con la lista de ciudades.
- **UI más resiliente**: si una ciudad se renderiza, su país siempre está disponible — no hay estado intermedio "cargando país".

La contrapartida (payload algo mayor y posible duplicación del mismo país en varias ciudades) es despreciable para listas de portafolio del orden de decenas o cientos de ciudades, y queda ampliamente compensada por la simplicidad del cliente.
