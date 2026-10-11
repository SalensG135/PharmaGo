# PharmaGo

Sitio web para consultar medicamentos y gestionar farmacias, inventario, EPS y usuarios. Es un sitio estático (HTML, CSS y JavaScript) y los datos se guardan en el navegador con localStorage, o en `data/db.json` si se usa el servidor local. La base de datos se conectará después.

## Estructura

```
sistema-web/
├── index.html
├── login.html
├── dashboard.html
├── css/
│   ├── estilos.css
│   ├── login.css
│   └── dashboard.css
├── js/
│   ├── core/          modelo, vista y controlador genéricos, utilidades y portada
│   ├── auth/          sesión, login y registro
│   ├── usuarios/
│   ├── roles/
│   ├── productos/     medicamentos
│   ├── farmacias/
│   ├── inventario/
│   ├── eps/
│   ├── reportes/
│   └── services/
│       ├── storageService.js    única capa que lee y escribe datos
│       └── datosIniciales.js    carga 5 registros de ejemplo por módulo
└── img/
```

Cada módulo tiene su Model (datos), View (campos y validaciones) y Controller (une los dos). Cuando se conecte la base de datos solo cambia `storageService.js`.

## Cómo probarlo

Opción 1, sin servidor: abre la carpeta con Live Server en VS Code y entra a `index.html`. Los datos se guardan en localStorage.

Opción 2, con servidor local (necesita Node.js): en una terminal dentro de esta carpeta ejecuta `node server.js` y abre http://localhost:3000. Los datos se guardan en `data/db.json` y son los mismos en cualquier navegador del computador. Para volver a cargar los datos de ejemplo, apaga el servidor y deja `data/db.json` con `{}`.

Para ver lo que se guarda con la opción 1: F12, pestaña Application, Local Storage, la dirección del sitio. Las claves empiezan por `pharmago_`.

## Cuentas de prueba

Contraseña de las cuentas de prueba: `1234`

| Rol | Correo |
|---|---|
| Paciente | paciente@pharmago.com |
| Farmacéutico | farmaceutico@pharmago.com |
| Administrador | admin@pharmago.com |

Usuarios de ejemplo, contraseña `123456`:

| Rol | Correo |
|---|---|
| Administrador | carlos.ramirez@pharmago.com |
| Farmacéutico | laura.gomez@pharmago.com |
| Paciente | andres.torres@correo.com |

Los pacientes también pueden crear su cuenta con el botón Registrarse.

## Roles

- Paciente: solo consulta, y únicamente ve Medicamentos y Farmacias.
- Farmacéutico: crear, editar y eliminar en medicamentos, inventario, farmacias y EPS.
- Administrador: todo lo anterior, además de usuarios y roles (puede eliminar usuarios).

## Validaciones

Cada formulario valida al salir de un campo y al enviar. Si hay errores, se muestran todos y no se guarda nada. Se revisa que los campos obligatorios estén llenos, el largo mínimo, solo letras en nombres, correo con formato válido, teléfono de 7 a 10 números, lote con letras, números o guiones, cantidad como número entero y que no se repitan correos ni lotes.

## Casos de prueba

| Caso | Qué debe pasar |
|---|---|
| Enviar un formulario vacío | Salen todos los mensajes de error y no se guarda nada |
| Nombre con números | Error en nombre |
| Correo "ana@correo" | Error en correo |
| Datos correctos | Mensaje de éxito, el registro aparece en la tabla y en Local Storage |
| Repetir un correo o un lote | Error: ya está registrado |
| Recargar la página (F5) | Los registros siguen ahí |
| Eliminar un registro | Desaparece de la tabla y de Local Storage |

## Publicar en Netlify

1. Verifica que `index.html` esté en la raíz de la carpeta `sistema-web`.
2. Entra a app.netlify.com/drop y arrastra la carpeta completa.
3. Netlify entrega una dirección tipo `https://nombre-aleatorio.netlify.app`.
4. En Site configuration, Change site name, pon un nombre propio.

Los nombres de carpetas y archivos van en minúscula y las rutas son relativas, así que funciona igual en Windows y en Netlify.

El archivo `_redirects` evita que se pueda abrir `server.js`, `package.json` y `data/` desde el sitio publicado. Aun así, antes de arrastrar la carpeta deja `data/db.json` con `{}`: si lo usaste con el servidor local, ahí quedan los usuarios y contraseñas guardados.

## Importante

localStorage guarda los datos solo en el navegador de cada persona. Quien abra el sitio desde otro computador no verá lo que tú guardaste, y en cada dominio (localhost y netlify.app) los datos son distintos. Tampoco es seguro: cualquiera puede leerlo desde DevTools. Por eso las contraseñas que se usen aquí deben ser solo de práctica.
