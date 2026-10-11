const usuarioVista = new Vista({
  titulo: "Gestión de Usuarios",
  campos: [
    { nombre: "nombres", etiqueta: "Nombres", tipo: "text", requerido: true, minimo: 2, max: 50,
      patron: "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$", mensajePatron: "Use solo letras y espacios." },
    { nombre: "apellidos", etiqueta: "Apellidos", tipo: "text", requerido: true, minimo: 2, max: 50,
      patron: "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$", mensajePatron: "Use solo letras y espacios." },
    { nombre: "correo", etiqueta: "Correo electrónico", tipo: "email", requerido: true, max: 100, ejemplo: "correo@ejemplo.com" },
    { nombre: "password", etiqueta: "Contraseña", tipo: "password", requerido: true, minimo: 6, max: 255 },
    { nombre: "idRol", etiqueta: "Rol", tipo: "select", requerido: true, numero: true,
      origen: { modelo: rolModel, valor: "idRol", texto: "nombre_rol" } }
  ]
});
