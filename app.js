const estudiantesRegistrados = [];
let editandoIndex = -1;

const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnVerJSON = document.getElementById("btnVerJSON");
const filtroNombre = document.getElementById("filtroNombre");
const filtroCarrera = document.getElementById("filtroCarrera");
const filtroSemestre = document.getElementById("filtroSemestre");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

btnAgregar.addEventListener("click", agregarEstudiante);
btnLimpiar.addEventListener("click", limpiarTabla);
btnVerJSON.addEventListener("click", mostrarModalJSONGeneral);

const campoNombre = document.getElementById("nombre");

campoNombre.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
});

filtroNombre.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
  aplicarFiltros();
});
filtroCarrera.addEventListener("change", aplicarFiltros);
filtroSemestre.addEventListener("input", aplicarFiltros);
btnLimpiarFiltros.addEventListener("click", limpiarFiltros);

function agregarEstudiante() {
  const estudiante = obtenerDatosFormulario();

  if (!validarEstudiante(estudiante)) {
    mostrarMensaje("Debe completar todos los campos.", "warning");
    Toastify({
      text: "Debe completar todos los campos.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #ff6b6b, #ee5a24)" }
    }).showToast();
    return;
  }

  if (editandoIndex >= 0) {
    estudiantesRegistrados[editandoIndex] = estudiante;
    editandoIndex = -1;
    btnAgregar.textContent = "Agregar estudiante";
    btnAgregar.classList.remove("btn-warning");
    btnAgregar.classList.add("btn-primary");
    mostrarMensaje("Estudiante editado correctamente.", "info");
    Toastify({
      text: "Estudiante editado correctamente.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #3498db, #2980b9)" }
    }).showToast();
  } else {
    estudiantesRegistrados.push(estudiante);
    mostrarMensaje("Estudiante agregado correctamente.", "success");
    Toastify({
      text: "Estudiante agregado correctamente.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #00b894, #00a86b)" }
    }).showToast();
  }

  renderizarTablaActual();
  actualizarTotal();
  limpiarFormulario();
}

function renderizarTablaActual() {
  const textoNombre = filtroNombre.value.trim().toLowerCase();
  const textoCarrera = filtroCarrera.value;
  const textoSemestre = filtroSemestre.value.trim().toLowerCase();
  const filtrosActivos = textoNombre !== "" || textoCarrera !== "" || textoSemestre !== "";

  if (filtrosActivos) {
    aplicarFiltros();
  } else {
    renderizarTabla(estudiantesRegistrados);
  }
}

function obtenerDatosFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const carrera = document.getElementById("carrera").value;
  const semestre = document.getElementById("semestre").value;

  return { nombre, carrera, semestre };
}

function validarEstudiante(estudiante) {
  if (estudiante.nombre === "" || estudiante.carrera === "" || estudiante.semestre === "") {
    return false;
  }

  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!soloLetras.test(estudiante.nombre)) {
    mostrarMensaje("El nombre solo debe contener letras.", "warning");
    Toastify({
      text: "El nombre solo debe contener letras.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #ff6b6b, #ee5a24)" }
    }).showToast();
    return false;
  }

  return true;
}

function renderizarTabla(lista) {
  const cuerpoTabla = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";

  lista.forEach(function (estudiante, indice) {
    const indiceReal = estudiantesRegistrados.indexOf(estudiante);

    const fila = document.createElement("tr");

    const columnaNumero = document.createElement("td");
    columnaNumero.textContent = indiceReal + 1;

    const columnaNombre = document.createElement("td");
    columnaNombre.textContent = estudiante.nombre;

    const columnaCarrera = document.createElement("td");
    columnaCarrera.textContent = estudiante.carrera;

    const columnaSemestre = document.createElement("td");
    columnaSemestre.textContent = estudiante.semestre;

    const columnaAcciones = document.createElement("td");

    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver JSON";
    btnVer.className = "btn btn-sm btn-dark me-1";
    btnVer.addEventListener("click", function () {
      mostrarModalJSONIndividual(estudiante);
    });

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn btn-sm btn-warning me-1";
    btnEditar.addEventListener("click", function () {
      editarEstudiante(indiceReal);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-sm btn-danger";
    btnEliminar.addEventListener("click", function () {
      eliminarEstudiante(indiceReal);
    });

    columnaAcciones.appendChild(btnVer);
    columnaAcciones.appendChild(btnEditar);
    columnaAcciones.appendChild(btnEliminar);

    fila.appendChild(columnaNumero);
    fila.appendChild(columnaNombre);
    fila.appendChild(columnaCarrera);
    fila.appendChild(columnaSemestre);
    fila.appendChild(columnaAcciones);

    cuerpoTabla.appendChild(fila);
  });
}

function editarEstudiante(index) {
  const estudiante = estudiantesRegistrados[index];

  document.getElementById("nombre").value = estudiante.nombre;
  document.getElementById("carrera").value = estudiante.carrera;
  document.getElementById("semestre").value = estudiante.semestre;

  editandoIndex = index;
  btnAgregar.textContent = "Guardar cambios";
  btnAgregar.classList.remove("btn-primary");
  btnAgregar.classList.add("btn-warning");

  mostrarMensaje("Editando estudiante: " + estudiante.nombre, "info");
  Toastify({
    text: "Editando: " + estudiante.nombre,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: { background: "linear-gradient(to right, #f39c12, #e67e22)" }
  }).showToast();
}

function eliminarEstudiante(index) {
  const estudiante = estudiantesRegistrados[index];

  Swal.fire({
    title: "¿Eliminar estudiante?",
    text: "Se eliminará a " + estudiante.nombre,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(function (result) {
    if (result.isConfirmed) {
      estudiantesRegistrados.splice(index, 1);
      renderizarTablaActual();
      actualizarTotal();
      mostrarMensaje("Estudiante eliminado correctamente.", "danger");
      Toastify({
        text: "Estudiante eliminado.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right, #e74c3c, #c0392b)" }
      }).showToast();

      if (editandoIndex === index) {
        editandoIndex = -1;
        btnAgregar.textContent = "Agregar estudiante";
        btnAgregar.classList.remove("btn-warning");
        btnAgregar.classList.add("btn-primary");
        limpiarFormulario();
      }
    }
  });
}

function mostrarModalJSONIndividual(estudiante) {
  const contenidoJSON = document.getElementById("contenidoJSON");
  contenidoJSON.textContent = JSON.stringify(estudiante, null, 2);

  document.getElementById("modalJSONLabel").textContent = "JSON del estudiante";

  const modal = new bootstrap.Modal(document.getElementById("modalJSON"));
  modal.show();
}

function mostrarModalJSONGeneral() {
  const contenidoJSON = document.getElementById("contenidoJSON");

  if (estudiantesRegistrados.length === 0) {
    contenidoJSON.textContent = "No existen estudiantes registrados.";
  } else {
    contenidoJSON.textContent = JSON.stringify(estudiantesRegistrados, null, 2);
  }

  document.getElementById("modalJSONLabel").textContent = "JSON de todos los estudiantes";

  const modal = new bootstrap.Modal(document.getElementById("modalJSON"));
  modal.show();
}

function aplicarFiltros() {
  const textoNombre = filtroNombre.value.trim().toLowerCase();
  const textoCarrera = filtroCarrera.value;
  const textoSemestre = filtroSemestre.value.trim().toLowerCase();

  const resultados = estudiantesRegistrados.filter(function (estudiante) {
    const coincideNombre = textoNombre === "" || estudiante.nombre.toLowerCase().includes(textoNombre);
    const coincideCarrera = textoCarrera === "" || estudiante.carrera === textoCarrera;
    const coincideSemestre = textoSemestre === "" || estudiante.semestre.toString().includes(textoSemestre);
    return coincideNombre && coincideCarrera && coincideSemestre;
  });

  renderizarTabla(resultados);

  const filtrosActivos = textoNombre !== "" || textoCarrera !== "" || textoSemestre !== "";
  if (filtrosActivos) {
    mostrarMensaje("Mostrando " + resultados.length + " de " + estudiantesRegistrados.length + " estudiante(s).", "info");
  } else {
    ocultarMensaje();
  }
}

function limpiarFiltros() {
  filtroNombre.value = "";
  filtroCarrera.value = "";
  filtroSemestre.value = "";
  renderizarTabla(estudiantesRegistrados);
  ocultarMensaje();
  Toastify({
    text: "Filtros limpiados.",
    duration: 2000,
    gravity: "top",
    position: "right",
    style: { background: "linear-gradient(to right, #636e72, #2d3436)" }
  }).showToast();
}

function actualizarTotal() {
  document.getElementById("totalEstudiantes").textContent = estudiantesRegistrados.length;
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("carrera").value = "";
  document.getElementById("semestre").value = "";
}

function limpiarTabla() {
  Swal.fire({
    title: "¿Limpiar todo?",
    text: "Se eliminarán todos los registros.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "Cancelar"
  }).then(function (result) {
    if (result.isConfirmed) {
      estudiantesRegistrados.length = 0;
      editandoIndex = -1;
      btnAgregar.textContent = "Agregar estudiante";
      btnAgregar.classList.remove("btn-warning");
      btnAgregar.classList.add("btn-primary");
      document.getElementById("cuerpoTabla").innerHTML = "";
      filtroNombre.value = "";
      filtroCarrera.value = "";
      filtroSemestre.value = "";
      actualizarTotal();
      limpiarFormulario();
      mostrarMensaje("Todo limpiado correctamente.", "secondary");
      Toastify({
        text: "Todos los registros eliminados.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right, #636e72, #2d3436)" }
      }).showToast();
    }
  });
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById("mensaje");
  mensaje.className = "alert alert-" + tipo + " mt-3";
  mensaje.textContent = texto;
}

function ocultarMensaje() {
  const mensaje = document.getElementById("mensaje");
  mensaje.className = "alert mt-3 d-none";
  mensaje.textContent = "";
}
