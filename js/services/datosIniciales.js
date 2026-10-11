const DatosIniciales = {
  marca: "pharmago_semilla",

  fecha(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  },

  agregar(clave, campoId, nuevos, esIgual) {
    const lista = StorageService.leer(clave);
    let ultimo = Math.max(0, ...lista.map(item => item[campoId] || 0));

    nuevos.forEach(nuevo => {
      if (!lista.some(item => esIgual(item, nuevo))) {
        ultimo++;
        lista.push({ ...nuevo, [campoId]: ultimo });
      }
    });

    StorageService.guardar(clave, lista);
    return lista;
  },

  idDe(lista, campoId, campo, valor) {
    const encontrado = lista.find(item => quitarTildes(item[campo]) === quitarTildes(valor));
    return encontrado ? encontrado[campoId] : null;
  },

  cargar() {
    if (StorageService.leer(this.marca).length > 0) return;

    const roles = this.agregar("pharmago_roles", "idRol", [
      { nombre_rol: "Paciente" },
      { nombre_rol: "Farmacéutico" },
      { nombre_rol: "Administrador" },
      { nombre_rol: "Auxiliar de farmacia" },
      { nombre_rol: "Auditor" }
    ], (a, b) => quitarTildes(a.nombre_rol) === quitarTildes(b.nombre_rol));

    this.agregar("pharmago_eps", "idEPS", [
      { nombre_eps: "Sanitas", estado: 1 },
      { nombre_eps: "Nueva EPS", estado: 1 },
      { nombre_eps: "Compensar", estado: 1 },
      { nombre_eps: "Sura", estado: 1 },
      { nombre_eps: "Famisanar", estado: 0 }
    ], (a, b) => quitarTildes(a.nombre_eps) === quitarTildes(b.nombre_eps));

    const farmacias = this.agregar("pharmago_farmacias", "idFarmacia", [
      { nombre_sede: "Sede Chapinero", direccion: "Calle 63 # 10-25", telefono: "6015550101", ciudad: "Bogotá D.C.", localidad: "Chapinero" },
      { nombre_sede: "Sede Suba", direccion: "Carrera 91 # 146-30", telefono: "6015550102", ciudad: "Bogotá D.C.", localidad: "Suba" },
      { nombre_sede: "Sede Kennedy", direccion: "Avenida Américas # 68-40", telefono: "6015550103", ciudad: "Bogotá D.C.", localidad: "Kennedy" },
      { nombre_sede: "Sede Usaquén", direccion: "Carrera 7 # 120-15", telefono: "6015550104", ciudad: "Bogotá D.C.", localidad: "Usaquén" },
      { nombre_sede: "Sede Fontibón", direccion: "Calle 17 # 100-50", telefono: "6015550105", ciudad: "Bogotá D.C.", localidad: "Fontibón" }
    ], (a, b) => quitarTildes(a.nombre_sede) === quitarTildes(b.nombre_sede));

    const medicamentos = this.agregar("pharmago_medicamentos", "idMedicamento", [
      { nombre_comercial: "Dolex", principio_activo: "Acetaminofén", presentacion: "Tabletas x 10", concentracion: "500 mg", laboratorio: "GSK" },
      { nombre_comercial: "Losartán", principio_activo: "Losartán potásico", presentacion: "Tabletas x 30", concentracion: "50 mg", laboratorio: "Genfar" },
      { nombre_comercial: "Metformina", principio_activo: "Metformina clorhidrato", presentacion: "Tabletas x 30", concentracion: "850 mg", laboratorio: "MK" },
      { nombre_comercial: "Amoxicilina", principio_activo: "Amoxicilina", presentacion: "Cápsulas x 21", concentracion: "500 mg", laboratorio: "Genfar" },
      { nombre_comercial: "Omeprazol", principio_activo: "Omeprazol", presentacion: "Cápsulas x 14", concentracion: "20 mg", laboratorio: "La Santé" }
    ], (a, b) => quitarTildes(a.nombre_comercial) === quitarTildes(b.nombre_comercial));

    const sede = nombre => this.idDe(farmacias, "idFarmacia", "nombre_sede", nombre);
    const medicina = nombre => this.idDe(medicamentos, "idMedicamento", "nombre_comercial", nombre);
    const rol = nombre => this.idDe(roles, "idRol", "nombre_rol", nombre);
    const ahora = new Date().toLocaleString();

    this.agregar("pharmago_inventario", "idInventario", [
      { idFarmacia: sede("Sede Chapinero"), idMedicamento: medicina("Dolex"), lote: "LOT-2026-A", fecha_vencimiento: this.fecha(400), cantidad: 120, fecha_actualizacion: ahora },
      { idFarmacia: sede("Sede Suba"), idMedicamento: medicina("Losartán"), lote: "LOT-2026-B", fecha_vencimiento: this.fecha(300), cantidad: 75, fecha_actualizacion: ahora },
      { idFarmacia: sede("Sede Kennedy"), idMedicamento: medicina("Metformina"), lote: "LOT-2025-C", fecha_vencimiento: this.fecha(15), cantidad: 40, fecha_actualizacion: ahora },
      { idFarmacia: sede("Sede Usaquén"), idMedicamento: medicina("Amoxicilina"), lote: "LOT-2025-D", fecha_vencimiento: this.fecha(-20), cantidad: 30, fecha_actualizacion: ahora },
      { idFarmacia: sede("Sede Fontibón"), idMedicamento: medicina("Omeprazol"), lote: "LOT-2026-E", fecha_vencimiento: this.fecha(500), cantidad: 6, fecha_actualizacion: ahora }
    ], (a, b) => a.idFarmacia === b.idFarmacia && a.idMedicamento === b.idMedicamento && a.lote === b.lote);

    this.agregar("pharmago_usuarios", "idUsuario", [
      { nombres: "Carlos", apellidos: "Ramírez", correo: "carlos.ramirez@pharmago.com", password: "123456", idRol: rol("Administrador") },
      { nombres: "Laura", apellidos: "Gómez", correo: "laura.gomez@pharmago.com", password: "123456", idRol: rol("Farmacéutico") },
      { nombres: "Andrés", apellidos: "Torres", correo: "andres.torres@correo.com", password: "123456", idRol: rol("Paciente") },
      { nombres: "María", apellidos: "Fernández", correo: "maria.fernandez@correo.com", password: "123456", idRol: rol("Paciente") },
      { nombres: "Julián", apellidos: "Castro", correo: "julian.castro@correo.com", password: "123456", idRol: rol("Paciente") }
    ], (a, b) => String(a.correo).toLowerCase() === b.correo);

    StorageService.guardar(this.marca, [{ cargado: true }]);
  }
};

DatosIniciales.cargar();
