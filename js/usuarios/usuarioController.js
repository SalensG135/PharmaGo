const usuarioController = new Controlador(usuarioModel, usuarioVista, {
  soloAdmin: true,
  campoDuplicado: "correo",
  mensajeDuplicado: "Este correo ya está registrado.",

  antesDeGuardar(datos) {
    datos.correo = datos.correo.toLowerCase();
  },

  motivoNoEliminar(usuario) {
    if (String(usuario.correo).toLowerCase() === Sesion.correo()) {
      return "No puedes eliminar la cuenta con la que iniciaste sesión.";
    }
    return "";
  },

  mensajeEliminar(usuario) {
    return "¿Eliminar a " + usuario.nombres + " " + usuario.apellidos + "? Ya no podrá iniciar sesión.";
  }
});
