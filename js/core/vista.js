class Vista {
  constructor(config) {
    this.titulo = config.titulo;
    this.campos = config.campos;
    this.contenedor = null;
  }

  opciones(campo) {
    if (campo.opciones) return campo.opciones;
    const origen = campo.origen;
    return origen.modelo.listar().map(item => {
      let texto = item[origen.texto];
      if (origen.extra) texto += " (" + item[origen.extra] + ")";
      return [item[origen.valor], texto];
    });
  }

  atributos(campo) {
    const partes = [];
    if (campo.requerido) partes.push("required");
    if (campo.max) partes.push(`maxlength="${campo.max}"`);
    if (campo.minimo) partes.push(`minlength="${campo.minimo}"`);
    if (campo.min !== undefined) partes.push(`min="${campo.min}"`);
    if (campo.patron) partes.push(`pattern="${campo.patron}"`);
    if (campo.mensajePatron) partes.push(`title="${escapar(campo.mensajePatron)}"`);
    return partes.join(" ");
  }

  campoHtml(campo) {
    let control = "";

    if (campo.tipo === "select") {
      const opciones = this.opciones(campo)
        .map(op => `<option value="${escapar(op[0])}">${escapar(op[1])}</option>`)
        .join("");
      control = `<select id="${campo.nombre}" ${this.atributos(campo)}><option value="">-- Seleccionar --</option>${opciones}</select>`;
    } else {
      const valor = campo.valor !== undefined ? `value="${escapar(campo.valor)}"` : "";
      const ejemplo = campo.ejemplo ? `placeholder="${escapar(campo.ejemplo)}"` : "";
      control = `<input type="${campo.tipo}" id="${campo.nombre}" ${this.atributos(campo)} ${valor} ${ejemplo}>`;
    }

    const asterisco = campo.requerido ? " *" : "";
    return `<div class="form-group"><label for="${campo.nombre}">${campo.etiqueta}${asterisco}</label>${control}<small class="error" id="error-${campo.nombre}"></small></div>`;
  }

  dibujar(contenedor, puedeEditar) {
    this.contenedor = contenedor;
    let html = `<h2>${this.titulo}</h2>`;

    if (!puedeEditar) {
      html += `<p class="aviso">Tu rol es de solo consulta. Puedes buscar y ver registros, pero no crear, editar ni eliminar.</p>`;
    } else {
      const campos = this.campos.filter(c => !c.soloTabla).map(c => this.campoHtml(c)).join("");
      html += `
        <form id="formulario" novalidate>
          <div class="form-grid">${campos}</div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="btnGuardar">Guardar</button>
            <button type="button" class="btn btn-secondary" id="btnCancelar">Cancelar</button>
          </div>
        </form>
        <p id="mensajeExito" role="status"></p>
        <hr>`;
    }

    html += `
      <div class="barra">
        <h3>Registros</h3>
        <input type="search" id="buscador" placeholder="Buscar en la tabla">
      </div>
      <div class="tabla-scroll"><table><thead></thead><tbody></tbody></table></div>
      <p class="vacio" id="vacio" hidden>${puedeEditar ? "Aún no hay registros. Complete el formulario para agregar el primero." : "Aún no hay registros."}</p>`;

    contenedor.innerHTML = html;
  }

  celda(campo, valor) {
    if (campo.nombre === "estado") {
      const activo = valor == 1;
      return `<span class="badge ${activo ? "active" : "inactive"}">${activo ? "Activo" : "Inactivo"}</span>`;
    }
    if (campo.tipo === "select") {
      const op = this.opciones(campo).find(o => o[0] == valor);
      return escapar(op ? op[1] : "-");
    }
    return escapar(valor === "" || valor == null ? "-" : valor);
  }

  dibujarTabla(filas, campoId, puedeEditar, sinEditar) {
    const columnas = this.campos.filter(c => c.tipo !== "password");
    const encabezados = columnas.map(c => `<th>${c.etiqueta}</th>`).join("");
    const acciones = puedeEditar ? "<th>Acciones</th>" : "";
    this.contenedor.querySelector("thead").innerHTML = `<tr><th>ID</th>${encabezados}${acciones}</tr>`;

    this.contenedor.querySelector("tbody").innerHTML = filas.map(fila => {
      const celdas = columnas.map(c => `<td>${this.celda(c, fila[c.nombre])}</td>`).join("");
      const id = fila[campoId];
      let botones = "";
      if (puedeEditar) {
        const editar = sinEditar ? "" : `<button class="btn btn-warning btn-sm" data-accion="editar" data-id="${id}">Editar</button>`;
        botones = `<td class="acciones">${editar}<button class="btn btn-danger btn-sm" data-accion="eliminar" data-id="${id}">Eliminar</button></td>`;
      }
      return `<tr><td>${id}</td>${celdas}${botones}</tr>`;
    }).join("");

    this.contenedor.querySelector("#vacio").hidden = filas.length > 0;
    this.filtrar("");
  }

  filtrar(texto) {
    const buscado = quitarTildes(texto);
    this.contenedor.querySelectorAll("tbody tr").forEach(tr => {
      tr.hidden = !quitarTildes(tr.textContent).includes(buscado);
    });
  }

  elemento(campo) {
    return this.contenedor.querySelector("#" + campo.nombre);
  }

  mensajeDe(campo) {
    const valor = campo.tipo === "password" ? this.elemento(campo).value : this.elemento(campo).value.trim();

    if (valor === "") {
      if (!campo.requerido) return "";
      return campo.tipo === "select" ? "Seleccione una opción." : "Complete este campo.";
    }

    if (campo.minimo && valor.length < campo.minimo) {
      return "Escriba al menos " + campo.minimo + " caracteres.";
    }

    if (campo.tipo === "email" && !formatoCorreo.test(valor)) {
      return "Escriba un correo válido, por ejemplo nombre@correo.com.";
    }

    if (campo.patron && !new RegExp(campo.patron).test(valor)) {
      return campo.mensajePatron;
    }

    if (campo.tipo === "number") {
      const numero = Number(valor);
      if (!Number.isInteger(numero)) return "Escriba un número entero.";
      if (campo.min !== undefined && numero < campo.min) return "El valor mínimo es " + campo.min + ".";
    }

    return "";
  }

  mostrarError(campo, mensaje) {
    const elemento = this.elemento(campo);
    this.contenedor.querySelector("#error-" + campo.nombre).textContent = mensaje;
    elemento.classList.toggle("invalido", mensaje !== "");
    elemento.classList.toggle("valido", mensaje === "" && elemento.value !== "");
  }

  validarCampo(campo) {
    const mensaje = this.mensajeDe(campo);
    this.mostrarError(campo, mensaje);
    return mensaje === "";
  }

  validarTodo() {
    const resultados = this.campos.filter(c => !c.soloTabla).map(c => this.validarCampo(c));
    return !resultados.includes(false);
  }

  limpiarErrores() {
    const formulario = document.getElementById("formulario");
    formulario.querySelectorAll(".valido, .invalido").forEach(el => el.classList.remove("valido", "invalido"));
    formulario.querySelectorAll(".error").forEach(caja => { caja.textContent = ""; });
  }

  exito(texto) {
    document.getElementById("mensajeExito").textContent = texto;
  }

  leerFormulario() {
    const datos = {};
    this.campos.filter(c => !c.soloTabla).forEach(c => {
      const valor = document.getElementById(c.nombre).value.trim();
      if (c.numero) {
        datos[c.nombre] = valor === "" ? null : Number(valor);
      } else {
        datos[c.nombre] = valor;
      }
    });
    return datos;
  }

  llenarFormulario(item) {
    this.campos.filter(c => !c.soloTabla).forEach(c => {
      const valor = item[c.nombre];
      document.getElementById(c.nombre).value = valor == null ? "" : valor;
    });
    this.limpiarErrores();
    this.exito("");
    this.textoBoton("Guardar cambios");
    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
  }

  limpiarFormulario() {
    document.getElementById("formulario").reset();
    this.limpiarErrores();
    this.textoBoton("Guardar");
  }

  textoBoton(texto) {
    document.getElementById("btnGuardar").textContent = texto;
  }
}
