const inventarioController = new Controlador(inventarioModel, inventarioVista, {
  campoDuplicado: "lote",
  mensajeDuplicado: "Ya existe este lote para esa farmacia y medicamento.",

  antesDeGuardar(datos) {
    datos.fecha_actualizacion = new Date().toLocaleString();
  }
});
