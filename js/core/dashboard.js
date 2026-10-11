Sesion.proteger();

const modulos = [
  { id: "productos", nombre: "Medicamentos", controlador: productoController },
  { id: "inventario", nombre: "Inventario", controlador: inventarioController },
  { id: "farmacias", nombre: "Farmacias", controlador: farmaciaController },
  { id: "eps", nombre: "EPS", controlador: epsController },
  { id: "reportes", nombre: "Reportes", controlador: reporteController },
  { id: "usuarios", nombre: "Usuarios", controlador: usuarioController, soloAdmin: true },
  { id: "roles", nombre: "Roles", controlador: rolController, soloAdmin: true }
];

const menu = document.getElementById("menu");
const contenido = document.getElementById("contenido");
const modulosPaciente = ["productos", "farmacias"];

const visibles = modulos.filter(m => {
  const permitido = !m.soloAdmin || Sesion.esAdmin();
  const visiblePaciente = Sesion.puedeEditar() || modulosPaciente.includes(m.id);
  return permitido && visiblePaciente;
});

menu.innerHTML = visibles.map(m => `<button data-id="${m.id}">${m.nombre}</button>`).join("");

menu.addEventListener("click", e => {
  const boton = e.target.closest("button");
  if (boton) abrir(boton.dataset.id);
});

function abrir(id) {
  const modulo = visibles.find(m => m.id === id);
  menu.querySelectorAll("button").forEach(b => b.classList.toggle("activo", b.dataset.id === id));
  modulo.controlador.mostrar(contenido);
}

document.getElementById("nombreUsuario").textContent = Sesion.nombre();
document.getElementById("rolUsuario").textContent = Sesion.rol();
document.getElementById("salir").addEventListener("click", () => Sesion.cerrar());

abrir(visibles[0].id);
