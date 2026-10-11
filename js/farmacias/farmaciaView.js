const farmaciaVista = new Vista({
  titulo: "Gestión de Farmacias",
  campos: [
    { nombre: "nombre_sede", etiqueta: "Nombre de la sede", tipo: "text", requerido: true, minimo: 3, max: 100, ejemplo: "Ej. Sede Chapinero" },
    { nombre: "direccion", etiqueta: "Dirección", tipo: "text", requerido: true, minimo: 5, max: 120, ejemplo: "Ej. Calle 63 # 10-25" },
    { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", max: 15, ejemplo: "Ej. 6015550101",
      patron: "^[0-9]{7,10}$", mensajePatron: "Use entre 7 y 10 números, sin espacios." },
    { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text", requerido: true, minimo: 3, max: 50, valor: "Bogotá D.C." },
    { nombre: "localidad", etiqueta: "Localidad", tipo: "text", requerido: true, minimo: 3, max: 50, ejemplo: "Ej. Suba" }
  ]
});
