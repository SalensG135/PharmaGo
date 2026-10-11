const rolVista = new Vista({
  titulo: "Gestión de Roles",
  campos: [
    { nombre: "nombre_rol", etiqueta: "Nombre del rol", tipo: "text", requerido: true, minimo: 3, max: 30, ejemplo: "Ej. Administrador",
      patron: "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$", mensajePatron: "Use solo letras y espacios." }
  ]
});
