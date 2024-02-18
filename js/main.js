/**********/
/* CLASES */
/**********/

class ListaDeTareas {
    constructor(nombreLista) {
        this.nombreLista = nombreLista;
        this.tareas = JSON.parse(localStorage.getItem(nombreLista)) || [];
        this.tiempoTotalTareas = this.calcularTiempoTotal();
        this.actualizarLocalStorage();
    }
    agregarTarea(nombre, tiempo) {
        const nuevaTarea = new Tarea(nombre, tiempo);
        this.tareas.push(nuevaTarea);
        this.tiempoTotalTareas += tiempo;
        this.actualizarLocalStorage();
    }

    eliminarTarea(nombreTarea) {
        const tareaIndex = this.tareas.findIndex(tarea => tarea.nombre.toLowerCase() === nombreTarea.trim().toLowerCase());
        if (tareaIndex !== -1) {
            const tareaEliminada = this.tareas.splice(tareaIndex, 1)[0];
            this.tiempoTotalTareas -= tareaEliminada.tiempo;
            this.actualizarLocalStorage();
        }
    }

    editarTarea(nombreTarea, nuevoNombre) {
        const tarea = this.tareas.find(t => t.nombre.toLowerCase() === nombreTarea.trim().toLowerCase());
        if (tarea) {
            tarea.nombre = nuevoNombre;
            this.actualizarLocalStorage();
        } else {
            console.error("No se encontro la tarea especificada para editar.");
        }
    }

    editarDuracionTarea(nombreTarea, nuevaDuracion) {
        const tarea = this.tareas.find(t => t.nombre.toLowerCase() === nombreTarea.trim().toLowerCase());
        if (tarea) {
            tarea.tiempo = nuevaDuracion;
            this.actualizarLocalStorage();
        } else {
            console.error("No se encontro la tarea especificada para editar la duracion.");
        }
    }

    mostrarTareas() {
        return this.tareas.map(tarea => `${tarea.nombre}: ${tarea.tiempo} horas`).join("\n");
    }

    calcularTiempoTotal() {
        return this.tareas.reduce((total, tarea) => total + tarea.tiempo, 0);
    }

    filtrarPorTiempoMinimo(tiempoMinimo) {
        const tareasFiltradas = this.tareas.filter(tarea => tarea.tiempo >= tiempoMinimo);
        this.mostrarTareasFiltradas(tareasFiltradas);
    }

    filtrarPorTiempoMaximo(tiempoMaximo) {
        const tareasFiltradas = this.tareas.filter(tarea => tarea.tiempo <= tiempoMaximo);
        this.mostrarTareasFiltradas(tareasFiltradas);
    }

    filtrarPorPalabraClave(palabraClave) {
        const tareasFiltradas = this.tareas.filter(tarea => tarea.nombre.toLowerCase().includes(palabraClave.toLowerCase()));
        this.mostrarTareasFiltradas(tareasFiltradas);
    }

    mostrarResultado(mensaje) {
        const resultadoContainer = document.getElementById('resultadoContainer');
        const divResultadoContainer = document.getElementById('resultadosFiltrado');

        divResultadoContainer.style.display = 'block';
        // Limpiar contenido anterior
        resultadoContainer.innerHTML = '';

        // Crear elemento para mostrar el mensaje
        const mensajeElement = document.createElement('div');
        mensajeElement.textContent = mensaje;

        if (mensaje.includes("Tareas Filtradas")) {
            const tareasFiltradas = mensaje.split('\n').slice(1); // Obtener solo las lineas de tareas filtradas
            // Crear fila para cada tarea filtrada
            tareasFiltradas.forEach(tarea => {
                const fila = document.createElement('div');
                fila.classList.add('row');

                // Crear columna para el nombre de la tarea
                const columnaNombre = document.createElement('div');
                columnaNombre.classList.add('col');
                columnaNombre.textContent = tarea.split(':')[0].trim();

                // Crear columna para el tiempo de la tarea
                const columnaTiempo = document.createElement('div');
                columnaTiempo.classList.add('col');
                columnaTiempo.textContent = tarea.split(':')[1].trim();

                // Agregar columnas a la fila
                fila.appendChild(columnaNombre);
                fila.appendChild(columnaTiempo);

                // Agregar fila al contenedor de resultados
                resultadoContainer.appendChild(fila);
            });
        } else {
            // Mostrar mensaje de que no hay tareas que coincidan con los criterios de filtrado
            mensajeElement.classList.add('text-danger');
            resultadoContainer.appendChild(mensajeElement);
        }
    }
    mostrarTareasFiltradas(tareasFiltradas) {
        if (tareasFiltradas.length > 0) {
            const cadenaTareasFiltradas = tareasFiltradas.map(tarea => `${tarea.nombre}: ${tarea.tiempo} horas`).join("\n");
            this.mostrarResultado("Tareas Filtradas:\n" + cadenaTareasFiltradas);
        } else {
            this.mostrarResultado("No hay tareas que coincidan con los criterios de filtrado. 🚫");
        }
    }
    actualizarLocalStorage() {
        localStorage.setItem(this.nombreLista, JSON.stringify(this.tareas));
    }
}

class Tarea {
    constructor(nombre, tiempo) {
        this.nombre = nombre;
        this.tiempo = tiempo;
    }
}


// Funcion para cargar los datos de las listas de tareas desde el localstorage
function cargarListasDesdeLocalStorage() {
    const nombresListas = Object.keys(localStorage);

    const listasCargadas = [];

    nombresListas.forEach(nombreLista => {
        const listaData = JSON.parse(localStorage.getItem(nombreLista));

        // Verificar si los datos son validos
        if (Array.isArray(listaData)) {
            const nuevaLista = new ListaDeTareas(nombreLista);
            nuevaLista.tareas = listaData;
            listasCargadas.push(nuevaLista);
        }
    });

    return listasCargadas;
}

// Obtener las listas de tareas almacenadas en localStorage
const listas = cargarListasDesdeLocalStorage() || [];

/* Evento DOM al cargar la pagina */
document.addEventListener('DOMContentLoaded', function () {


    const formAgregarLista = document.getElementById('formAgregarLista');
    const nombreListaInput = document.getElementById('nombreLista');
    const resumenListas = document.getElementById('resumenListas');

    const formularioAgregarLista = document.getElementById('formularioAgregarLista');
    const seccionTareas = document.getElementById('seccionTareas');
    const btnMostrarFormularioAgregarLista = document.getElementById('btnMostrarFormularioAgregarLista');
    const btnMostrarFormularioModificarLista = document.getElementById('btnMostrarFormularioModificarLista');
    const btnMostrarFormularioEliminarLista = document.getElementById('btnMostrarFormularioEliminarLista');
    const formularioModificarLista = document.getElementById('formularioModificarLista');
    const formularioEliminarLista = document.getElementById('formularioEliminarLista');
    const formularioFiltrarTareas = document.getElementById('formularioFiltrarTareas');

    const listaTareasEliminar = document.getElementById('nombreListaEliminar');

    const btnAgregarTarea = document.getElementById("btnAgregarTarea");
    const btnFiltrarTareas = document.getElementById("btnFiltrarTareas");

    const resultadosFiltrado = document.getElementById("resultadosFiltrado");



    mostrarReloj();

    const mensajeInicial = document.getElementById('mensajeInicial');

    if (listas.length === 0) {
        // Mostrar el mensaje inicial
        mensajeInicial.style.display = 'block';
        resumenListas.style.display = 'none';
    } else {
        mensajeInicial.style.display = 'none';
        resumenListas.style.display = 'block';
        actualizarResumenListas();
    }

    /***************************************** */
    /* Funciones para agregar listas de tareas */
    /***************************************** */
    formAgregarLista.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreLista = nombreListaInput.value.trim();

        if (nombreLista) {
            const nuevaLista = new ListaDeTareas(nombreLista);
            listas.push(nuevaLista);

            actualizarResumenListas();
            /* Ocultar elementos HTML */
            resultadosFiltrado.style.display = 'none';
            formularioFiltrarTareas.style.display = 'none';
            seccionTareas.style.display = 'none';
            formularioAgregarLista.style.display = 'none';
            mensajeInicial.style.display = 'none';

            nombreListaInput.value = '';
        } else {
            mostrarNotificacion("Por favor, ingresa un nombre para la lista de tareas. 🚫");
        }
    });

    btnMostrarFormularioAgregarLista.addEventListener('click', function () {
        seccionTareas.style.display = 'none';
        mostrarFormularioAgregarLista();

    });

    function mostrarFormularioAgregarLista() {
        // Ocultar otros formularios
        formularioFiltrarTareas.style.display = 'none';
        formularioModificarLista.style.display = 'none';
        formularioEliminarLista.style.display = 'none';

        // Mostrar el formulario de agregar lista
        formularioAgregarLista.style.display = 'block';
    }

    /******************************************** */
    /*  Funciones para modificar listas de tareas */
    /******************************************** */

    btnMostrarFormularioModificarLista.addEventListener('click', function () {
        seccionTareas.style.display = 'none';
        mostrarFormularioModificarLista();
    });

    function mostrarFormularioModificarLista() {
        // Ocultar otros formularios
        formularioFiltrarTareas.style.display = 'none';
        formularioAgregarLista.style.display = 'none';
        formularioEliminarLista.style.display = 'none';
        seccionTareas.style.display = 'none';
        resultadosFiltrado.style.display = 'none';
        // Mostrar el formulario de modificar lista
        formularioModificarLista.style.display = 'block';
        // Actualizar las opciones del selector
        actualizarListasModificar();
    }

    function actualizarListasModificar() {
        const selectModificar = document.getElementById('nombreListaModificar');
        selectModificar.innerHTML = '';
        // Cargar selector
        listas.forEach(lista => {
            const option = document.createElement('option');
            option.value = lista.nombreLista;
            option.innerHTML = lista.nombreLista;
            selectModificar.appendChild(option);
        });
    }

    function modificarListaTareas() {
        const nombreLista = document.getElementById('nombreListaModificar').value;
        const nuevoNombre = document.getElementById('nuevoNombreLista').value;

        if (nombreLista && nuevoNombre) {
            const lista = listas.find(l => l.nombreLista === nombreLista);
            if (lista) {
                lista.nombreLista = nuevoNombre;

                const listaData = JSON.parse(localStorage.getItem(nombreLista));
                localStorage.removeItem(nombreLista); // Eliminar la entrada anterior
                localStorage.setItem(nuevoNombre, JSON.stringify(listaData));

                actualizarResumenListas();
                mostrarNotificacion("El nombre de la lista ha sido modificado correctamente. ✅");
                // Ocultar el formulario de modificar lista al terminar
                formularioModificarLista.style.display = 'none';
            } else {
                mostrarNotificacion("La lista especificada no fue encontrada. 🚫");
            }
        } else {
            mostrarNotificacion("Por favor, ingresa los nombres tanto de la lista actual como el nuevo nombre. 🚫");
        }
    }


    document.getElementById('formModificarLista').addEventListener('submit', function (e) {
        e.preventDefault();
        modificarListaTareas();
    });

    /***************************************** */
    /* Funciones para Eliminar lista de tareas */
    /***************************************** */

    btnMostrarFormularioEliminarLista.addEventListener('click', function () {
        actualizarListasEliminar();
        mostrarFormularioEliminarLista();
    });

    function mostrarFormularioEliminarLista() {
        // Ocultar otros formularios
        formularioFiltrarTareas.style.display = 'none';
        formularioAgregarLista.style.display = 'none';
        formularioModificarLista.style.display = 'none';
        seccionTareas.style.display = 'none';
        resultadosFiltrado.style.display = 'none';
        // Mostrar el formulario de eliminar lista
        formularioEliminarLista.style.display = 'block';
        actualizarListasEliminar();
    }


    function actualizarListasEliminar() {
        listaTareasEliminar.innerHTML = '';
        // Agregar opciones al select
        listas.forEach(lista => {
            const opcion = document.createElement('option');
            opcion.value = lista.nombreLista;
            opcion.innerHTML = lista.nombreLista;
            listaTareasEliminar.appendChild(opcion);
        });
    }

    document.getElementById('formEliminarLista').addEventListener('submit', function (e) {
        e.preventDefault();
        eliminarListaDeTareas();
    });



    function eliminarListaDeTareas() {
        const nombreListaEliminar = document.getElementById('nombreListaEliminar').value;

        if (nombreListaEliminar) {
            const indiceListaEliminar = listas.findIndex(lista => lista.nombreLista === nombreListaEliminar);
            if (indiceListaEliminar !== -1) {
                listas.splice(indiceListaEliminar, 1);
                localStorage.removeItem(nombreListaEliminar); 
                actualizarResumenListas();
                mostrarNotificacion("La lista de tareas ha sido eliminada correctamente. ✅");
                formularioEliminarLista.style.display = 'none'; // Ocultar el formulario despues de eliminar
            } else {
                mostrarNotificacion("La lista especificada no fue encontrada. 🚫");
            }
        } else {
            mostrarNotificacion("Por favor, selecciona una lista de tareas para eliminar. 🚫");
        }
    }

    /*******************************/
    /* Resumen de listas de tareas */
    /*******************************/

    function actualizarResumenListas() {
        resumenListas.innerHTML = '';

        if (listas.length === 0) {
            mensajeInicial.style.display = 'block';
            resumenListas.style.display = 'none';
        } else {
            resumenListas.style.display = 'block';
            listas.forEach(lista => {
                const listaElemento = document.createElement('div');
                listaElemento.className = 'lista-resumen';

                let tiempoTotalLista = 0;
                lista.tareas.forEach(tarea => {
                    tiempoTotalLista += tarea.tiempo;
                });

                // Crear el texto a mostrar en el resumen
                const textoLista = `${lista.nombreLista} - Total horas: ${tiempoTotalLista.toFixed(2)}`;
                listaElemento.innerHTML = textoLista;

                resumenListas.appendChild(listaElemento);
            });

            // Ocultar el mensaje inicial si hay listas de tareas
            mensajeInicial.style.display = 'none';
        }
    }

    /******** */
    /* Tareas */
    /******** */

    /* Agregar tareas */
    btnAgregarTarea.addEventListener("click", clickAgregaTarea)
    function clickAgregaTarea() {
        agregarTarea();
    }

    /* Actualizar tareas */
    function actualizarListaTareas() {
        const listaTareasElemento = document.getElementById('listaTareas');
        listaTareasElemento.innerHTML = '';

        const nombreListaSeleccionada = document.getElementById('listaTareasCombo').value;
        const listaSeleccionada = listas.find(l => l.nombreLista === nombreListaSeleccionada);

        if (listaSeleccionada && listaSeleccionada.tareas.length > 0) {
            // Mostrar el contenedor del texto de las tareas
            document.getElementById('contenedorTextoTareas').style.display = 'block';
            // Iterar sobre todas las tareas de la lista seleccionada y agregarlas a la interfaz
            listaSeleccionada.tareas.forEach(tarea => {
                const li = document.createElement('li');
                // Campo editable para el nombre de la tarea
                const nombreTarea = document.createElement('span');
                nombreTarea.innerHTML = tarea.nombre;
                nombreTarea.contentEditable = true;

                // Campo editable para la duracion de la tarea
                const duracionTarea = document.createElement('span');
                duracionTarea.innerHTML = tarea.tiempo;
                duracionTarea.contentEditable = true;

                // Boton de editar
                const editarButton = document.createElement('button');
                editarButton.innerHTML = 'Editar';
                editarButton.className = "btn btn-warning";
                editarButton.onclick = function () {
                    const nuevoNombre = nombreTarea.innerHTML.trim();
                    const nuevaDuracion = parseFloat(duracionTarea.innerHTML);
                    listaSeleccionada.editarTarea(tarea.nombre, nuevoNombre);
                    listaSeleccionada.editarDuracionTarea(tarea.nombre, nuevaDuracion);
                };

                editarButton.onclick = function () {
                    // Habilitar la edicion de los campos al hacer clic en el boton editar
                    nombreTarea.contentEditable = true;
                    nombreTarea.focus(); // Colocar el cursor en el campo de edicion
                    duracionTarea.contentEditable = true;
                };

                // Boton de eliminar
                const eliminarButton = document.createElement('button');
                eliminarButton.innerHTML = 'Eliminar';
                eliminarButton.className = "btn btn-danger";
                eliminarButton.onclick = function () {
                    listaSeleccionada.eliminarTarea(tarea.nombre);
                    actualizarListaTareas(listaSeleccionada); // Actualizar el listado de tareas despues de eliminar la tarea
                };

                // Evento para manejar el guardado de los cambios al presionar Enter o hacer clic fuera del campo de edicion
                nombreTarea.addEventListener('blur', function (event) {
                    const nuevoNombre = nombreTarea.innerHTML.trim();
                    listaSeleccionada.editarTarea(tarea.nombre, nuevoNombre);
                    nombreTarea.innerHTML = nuevoNombre; // Actualizar el contenido del nombre de la tarea en la interfaz
                });

                // Evento para manejar el guardado de los cambios de la duracion
                duracionTarea.addEventListener('blur', function (event) {
                    const nuevaDuracion = parseFloat(duracionTarea.innerHTML);
                    listaSeleccionada.editarDuracionTarea(tarea.nombre, nuevaDuracion);
                    duracionTarea.innerHTML = nuevaDuracion; // Actualizar el contenido de la duracion de la tarea en la interfaz
                });

                // Agregar elementos al elemento de lista
                li.appendChild(nombreTarea);
                li.appendChild(document.createTextNode(': ')); // Separador entre nombre y duracion
                li.appendChild(duracionTarea);
                li.appendChild(document.createTextNode('hora(s)')); // Unidad de tiempo para la duracion de la tarea
                li.appendChild(editarButton);
                li.appendChild(eliminarButton);

                listaTareasElemento.appendChild(li);
            });
        }
    }

    /* Llamada a actualizarListaTareas para reflejar cambios de forma dinamica */
    document.getElementById('listaTareasCombo').addEventListener('change', actualizarListaTareas);

    document.getElementById('formularioTarea').addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener los valores ingresados por el usuario
        const nombreTarea = document.getElementById('entradaNombreTarea').value.trim();
        const tiempoTarea = parseFloat(document.getElementById('entradaTiempoTarea').value.trim());
        const nombreListaSeleccionada = document.getElementById('listaTareasCombo').value;

        // Verificar que se hayan ingresado valores validos
        if (nombreTarea && !isNaN(tiempoTarea) && tiempoTarea > 0) {
            // Encontrar la lista de tareas correspondiente al nombre de la lista seleccionada
            const listaSeleccionada = listas.find(lista => lista.nombreLista === nombreListaSeleccionada);

            if (listaSeleccionada) {
                listaSeleccionada.agregarTarea(nombreTarea, tiempoTarea);

                actualizarListaTareas(listaSeleccionada);
                actualizarResumenListas();

                // Mostrar notificacion de exito
                mostrarNotificacion(`Tarea "${nombreTarea}" agregada a la lista "${nombreListaSeleccionada}". ✅`);

                document.getElementById('entradaNombreTarea').value = '';
                document.getElementById('entradaTiempoTarea').value = '';

            } else {
                mostrarNotificacion('Error: Lista de tareas no encontrada. 🚫');
            }
        } else {
            mostrarNotificacion('Error: Por favor, ingresa un nombre valido para la tarea y un tiempo valido en horas. 🚫');
        }

        // Ocultar formulario al terminar
        document.getElementById('seccionTareas').style.display = 'none';
    });

    /************/
    /* Filtrado */
    /********** */

    /* Filtrar tareas */
    btnFiltrarTareas.addEventListener("click", clickFiltrarTareas);
    function clickFiltrarTareas() {
        mostrarFormularioFiltrarTareas();
    }

    document.getElementById('formularioFiltrarTareas').addEventListener('submit', function (e) {
        e.preventDefault();

        const tiempoMinimo = parseFloat(document.getElementById('tiempoMinimo').value);
        const tiempoMaximo = parseFloat(document.getElementById('tiempoMaximo').value);
        const palabraClave = document.getElementById('palabraClave').value.trim().toLowerCase();

        // Encontrar la lista de tareas correspondiente al nombre de la lista seleccionada
        const nombreListaSeleccionada = document.getElementById('listaTareasFiltrarCombo').value;
        const listaSeleccionada = listas.find(lista => lista.nombreLista === nombreListaSeleccionada);

        if (listaSeleccionada) {
            // Verificar si al menos un campo tiene un valor valido para aplicar el filtrado
            if (!isNaN(tiempoMinimo) || !isNaN(tiempoMaximo) || palabraClave !== '') {
                // Aplicar filtros
                const tareasFiltradas = listaSeleccionada.tareas.filter(tarea => {
                    let cumpleCriterio = true;
                    if (!isNaN(tiempoMinimo) && tarea.tiempo < tiempoMinimo) {
                        cumpleCriterio = false;
                    }
                    if (!isNaN(tiempoMaximo) && tarea.tiempo > tiempoMaximo) {
                        cumpleCriterio = false;
                    }
                    if (palabraClave !== '' && !tarea.nombre.toLowerCase().includes(palabraClave)) {
                        cumpleCriterio = false;
                    }
                    return cumpleCriterio;
                });

                listaSeleccionada.mostrarTareasFiltradas(tareasFiltradas);
            } else {
                listaSeleccionada.mostrarTareasFiltradas(listaSeleccionada.tareas);
            }
        } else {
            mostrarNotificacion('Error: Lista de tareas no encontrada. 🚫');
        }
        // Ocultar formulario para filtrado de tareas al terminar
        document.getElementById('formularioFiltrarTareas').style.display = 'none';
    });

    /**************** */
    /* Notificaciones */
    /* ************** */
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.innerHTML = mensaje;
        document.body.appendChild(notificacion);
        setTimeout(function () {
            notificacion.remove();
        }, 5000); // Eliminar la notificacion despues de 5 segundos
    }

    /****************/
    /* Fecha y hora */
    /****************/
    function mostrarReloj() {
        const relojElemento = document.getElementById('reloj');
        if (relojElemento) {
            const actualizarReloj = () => {
                const fechaHoraActual = new Date();

                const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
                const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque los meses comienzan desde 0
                const año = fechaHoraActual.getFullYear();

                const horas = fechaHoraActual.getHours().toString().padStart(2, '0');
                const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
                const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

                const meses = [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];

                const fechaFormateada = `${dia} de ${meses[parseInt(mes) - 1]} del ${año}`;
                const horaFormateada = `${horas}:${minutos}<span class="separadorSegundosReloj">:</span>${segundos}`;

                relojElemento.innerHTML = `${fechaFormateada} <p class="text-center">${horaFormateada}</p>`;
            };

            setInterval(actualizarReloj, 1000);
            actualizarReloj();
        }
    }

});

/******** */
/* TAREAS */
/******** */

// Funcion para actualizar las opciones del combobox (es decir las listas)
function actualizarOpcionesCombo() {
    const listaTareasCombo = document.getElementById('listaTareasCombo');
    listaTareasCombo.innerHTML = ''; // Limpiar opciones anteriores

    // Obtener las listas de tareas almacenadas en localStorage
    const listas = cargarListasDesdeLocalStorage();

    // Agregar las opciones al select
    listas.forEach(lista => {
        const option = document.createElement('option');
        option.value = lista.nombreLista;
        option.innerHTML = lista.nombreLista;
        listaTareasCombo.appendChild(option);
    });
}


// Funcion para mostrar el formulario de agregar tarea
function mostrarFormularioAgregarTarea() {

    document.getElementById('seccionTareas').style.display = 'block';
    // Actualizar las opciones del combobox
    actualizarOpcionesCombo();

    // Ocultar otros formularios si estan visibles
    document.getElementById('formularioFiltrarTareas').style.display = 'none';
    document.getElementById('formularioAgregarLista').style.display = 'none';
    document.getElementById('formularioModificarLista').style.display = 'none';
    document.getElementById('formularioEliminarLista').style.display = 'none';
    document.getElementById('resultadosFiltrado').style.display = 'none';

}

function agregarTarea() {
    mostrarFormularioAgregarTarea();

}

// Funcion para cargar las opciones del select desde el localStorage
function cargarOpcionesListaTareas() {
    const listaTareasCombo = document.getElementById('listaTareasFiltrarCombo');
    listaTareasCombo.innerHTML = ''; // Limpiar opciones anteriores

    const listas = cargarListasDesdeLocalStorage();

    if (listas) {

        listas.forEach(lista => {
            const option = document.createElement('option');
            option.value = lista.nombreLista;
            option.innerHTML = lista.nombreLista;
            listaTareasCombo.appendChild(option);
        });
    }
}

// Funcion para mostrar el formulario de filtrado de tareas
function mostrarFormularioFiltrarTareas() {

    document.getElementById('formularioFiltrarTareas').style.display = 'block';
    // Ocultar otros formularios si estan visibles
    document.getElementById('seccionTareas').style.display = 'none';
    document.getElementById('formularioAgregarLista').style.display = 'none';
    document.getElementById('formularioModificarLista').style.display = 'none';
    document.getElementById('formularioEliminarLista').style.display = 'none';
    document.getElementById('resultadosFiltrado').style.display = 'none';  

    // Actualizar las opciones del combobox desde localstorage
    cargarOpcionesListaTareas();

}



