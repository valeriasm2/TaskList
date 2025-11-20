document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    inicializarApp();
}

if (typeof cordova === 'undefined') {
    $(document).ready(function() {
        inicializarApp();
    });
}

function inicializarApp() {
    // Cargar tareas desde localStorage
    function cargarTareas() {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        $("#miLista").empty();
        tareas.forEach(t => agregarTarea(t, false));
    }

    // Guardar tareas en localStorage
    function guardarTareas() {
        const tareas = [];
        $("#miLista li").each(function() {
            tareas.push($(this).find(".task-text").text());
        });
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    // Dialog nueva tarea
    $("#taskform").dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "OK": function() {
                agregarTarea();
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });

    // Dialog editar tarea
    $("#editForm").dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "OK": function() {
                const nuevaTarea = $("#editText").val().trim();
                if (nuevaTarea !== "") {
                    const li = $(this).data("li");
                    li.find(".task-text").text(nuevaTarea);
                    guardarTareas();
                }
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });

    // Event listener para el botón de añadir
    document.getElementById('btnAdd').onclick = function() {
        $("#tasktext").val("");
        $("#taskform").dialog("open");
    };

    function agregarTarea(texto = null, guardar = true) {
        let tarea = texto || $("#tasktext").val().trim();
        if (tarea === "") { alert("Escribe una tarea"); return; }

        const li = $("<li></li>");
        const span = $("<span class='task-text'></span>").text(tarea);

        const btnEditar = $("<button class='btnTask btn-edit'>Edit</button>");
        btnEditar.click(function (event) {
            const liActual = $(event.target).closest("li");
            const textoActual = liActual.find(".task-text").text();
            $("#editText").val(textoActual);
            $("#editForm").data("li", liActual).dialog("open");
        });

        const btnEliminar = $("<button class='btnTask btn-delete'>X</button>");
        btnEliminar.click(function (event) {
            $(event.target).closest("li").remove();
            guardarTareas();
        });

        li.append(span).append(btnEditar).append(btnEliminar);
        $("#miLista").append(li);

        if (guardar) guardarTareas();
    }

    cargarTareas();
}
