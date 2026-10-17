// agenda.js

// Variables globales para almacenar los turnos cargados y validar sobreturnos
let turnosCargadosGlobal = [];
const coloresTurnos = ['#20c997', '#0dcaf0', '#6f42c1', '#d63384', '#fd7e14', '#198754'];

document.addEventListener('DOMContentLoaded', () => {
    generarCalendarioInfinito();
    cargarTurnos();

    // ==========================================
    // BUSCADOR Y NUEVA CLIENTA
    // ==========================================
    const buscadorInput = document.getElementById('buscador-clienta');
    const listaResultados = document.getElementById('lista-resultados-clientas');
    const inputIdClienta = document.getElementById('id-clienta-seleccionada');

    buscadorInput.addEventListener('input', async (e) => {
        const termino = e.target.value.trim();
        if (termino.length < 2) {
            listaResultados.style.display = 'none';
            return;
        }
        try {
            const respuesta = await fetch(`api/buscar_clientas.php?q=${encodeURIComponent(termino)}`);
            const resultado = await respuesta.json();

            if (resultado.exito && resultado.clientas.length > 0) {
                listaResultados.innerHTML = '';
                resultado.clientas.forEach(clienta => {
                    const li = document.createElement('li');
                    li.innerText = `${clienta.nombre} ${clienta.apellido} (${clienta.telefono})`;
                    li.addEventListener('click', () => {
                        inputIdClienta.value = clienta.id_clienta;
                        buscadorInput.value = `${clienta.nombre} ${clienta.apellido}`;
                        listaResultados.style.display = 'none';
                    });
                    listaResultados.appendChild(li);
                });
                listaResultados.style.display = 'block';
            } else {
                listaResultados.style.display = 'none';
            }
        } catch (error) {
            console.error("Error buscando:", error);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== buscadorInput && e.target !== listaResultados) {
            listaResultados.style.display = 'none';
        }
    });

    const btnNuevaClienta = document.getElementById('btn-nueva-clienta');
    const divCamposNueva = document.getElementById('campos-nueva-clienta');
    const btnGuardarClienta = document.getElementById('btn-guardar-clienta');

    btnNuevaClienta.addEventListener('click', () => {
        divCamposNueva.style.display = divCamposNueva.style.display === 'none' ? 'block' : 'none';
    });

    btnGuardarClienta.addEventListener('click', async () => {
        const nombre = document.getElementById('nuevo-nombre').value.trim();
        const apellido = document.getElementById('nuevo-apellido').value.trim();
        const telefono = document.getElementById('nuevo-telefono').value.trim();

        if (!nombre || !apellido || !telefono) {
            alert("Completa nombre, apellido y teléfono.");
            return;
        }

        try {
            const respuesta = await fetch('api/guardar_clienta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, telefono })
            });
            const resultado = await respuesta.json();
            if (resultado.exito) {
                alert("Clienta registrada");
                inputIdClienta.value = resultado.id_clienta;
                buscadorInput.value = resultado.nombre_completo;
                divCamposNueva.style.display = 'none';
            } else {
                alert("Error: " + resultado.mensaje);
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    });

    // ==========================================
    // GUARDAR TURNO
    // ==========================================
    const formTurno = document.getElementById('form-nuevo-turno');
    formTurno.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // LEEMOS LOS DATOS OCULTOS DEL FORMULARIO
        const fechaGuardada = document.getElementById('fecha-turno-oculta').value;
        const idClientaReal = document.getElementById('id-clienta-seleccionada').value;
        const horaExacta = document.getElementById('hora-inicio-turno').value;

        // Failsafes
        if (!fechaGuardada || fechaGuardada === "") {
            alert("Error: No se detectó la fecha. Toca nuevamente el horario en el calendario.");
            return;
        }

        if (idClientaReal === "" || idClientaReal === "0") {
             alert("Por favor, busca una clienta o crea una nueva antes de agendar.");
             return;
        }

        const fechaHoraCompleta = `${fechaGuardada} ${horaExacta}:00`;

        // VALIDACIÓN DE SOBRETURNO Y DUPLICADOS EXACTOS
        let esSobreturnoAutomatico = false;
        let conflictoHorarioExacto = false;

        turnosCargadosGlobal.forEach(t => {
            if (t.fecha_hora_inicio.split(' ')[0] === fechaGuardada) {
                if (t.fecha_hora_inicio === fechaHoraCompleta) {
                    conflictoHorarioExacto = true;
                }
                esSobreturnoAutomatico = true; 
            }
        });

        if (conflictoHorarioExacto) {
            alert("Error: No puedes agendar dos turnos que inicien a la misma hora exacta.");
            return;
        }

        const datosTurno = {
            fecha_hora: fechaHoraCompleta,
            servicio_principal: document.getElementById('servicio-principal').value,
            duracion_bloque: document.getElementById('duracion-bloque').value,
            es_sobreturno: esSobreturnoAutomatico, 
            observaciones: document.getElementById('observaciones').value,
            id_clienta: idClientaReal 
        };

        try {
            const respuesta = await fetch('api/guardar_turno.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosTurno)
            });
            const resultado = await respuesta.json();

            if(resultado.exito) {
                alert("¡Turno guardado!");
                cerrarModal();
                cargarTurnos();
            } else {
                alert("Error: " + resultado.mensaje);
            }
        } catch (error) {
            console.error("Error petición:", error);
        }
    });
});

// ==========================================
// FUNCIONES DEL GANTT Y CALENDARIO
// ==========================================

function generarCalendarioInfinito() {
    const contenedorAgenda = document.getElementById('contenedor-agenda');
    contenedorAgenda.innerHTML = ''; 

    const fechaInicial = new Date(); 
    fechaInicial.setHours(0, 0, 0, 0);
    const diasGenerar = 90; 
    const nombresDiasCompletos = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diasLaborables = [4, 5, 6]; 

    const bloquesHorarios = [
        { hora: 7, min: 30, texto: "07:30" },
        { hora: 10, min: 30, texto: "10:30" },
        { hora: 13, min: 30, texto: "13:30" }
    ];

    for (let i = 0; i < diasGenerar; i++) {
        const fechaActual = new Date(fechaInicial);
        fechaActual.setDate(fechaInicial.getDate() + i);
        const diaSemanaNum = fechaActual.getDay();

        if (diasLaborables.includes(diaSemanaNum)) {
            const numDia = fechaActual.getDate();
            const nombreCompleto = nombresDiasCompletos[diaSemanaNum];
            const idDia = `${nombreCompleto}-${numDia}`;
            
            const anio = fechaActual.getFullYear();
            const mesStr = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const diaStr = String(fechaActual.getDate()).padStart(2, '0');
            const fechaString = `${anio}-${mesStr}-${diaStr}`; 

            const seccionDia = document.createElement('section');
            seccionDia.id = idDia;
            seccionDia.className = 'dia-agenda';
            seccionDia.innerHTML = `<h3>${nombreCompleto} ${numDia}</h3>`;

            const ganttContainer = document.createElement('div');
            ganttContainer.className = 'dia-gantt-container';
            
            bloquesHorarios.forEach(bloque => {
                const fila = document.createElement('div');
                fila.className = 'fila-fondo';
                fila.innerHTML = `
                    <div class="hora-etiqueta">${bloque.texto}</div>
                    <div class="espacio-clic-fondo"></div>
                `;
                
                const espacioFondo = fila.querySelector('.espacio-clic-fondo');
                espacioFondo.addEventListener('click', () => {
                    abrirModal(idDia, bloque.texto, fechaString);
                });
                
                ganttContainer.appendChild(fila);
            });

            const capaTurnos = document.createElement('div');
            capaTurnos.className = 'capa-turnos';
            capaTurnos.id = `capa-turnos-${fechaString}`;
            ganttContainer.appendChild(capaTurnos);

            seccionDia.appendChild(ganttContainer);
            contenedorAgenda.appendChild(seccionDia);
        }
    }
}

async function cargarTurnos() {
    try {
        const respuesta = await fetch('api/obtener_turnos.php');
        const resultado = await respuesta.json();
        
        document.querySelectorAll('.capa-turnos').forEach(capa => capa.innerHTML = '');

        if (resultado.exito) {
            turnosCargadosGlobal = resultado.turnos; 
            
            let colorIndex = 0;
            resultado.turnos.forEach(turno => {
                const colorFondo = coloresTurnos[colorIndex % coloresTurnos.length];
                pintarTurnoEnAgenda(turno, colorFondo);
                colorIndex++;
            });
        }
    } catch (error) {
        console.error("Error cargar turnos:", error);
    }
}

function pintarTurnoEnAgenda(turno, colorFondo) {
    const fechaPart = turno.fecha_hora_inicio.split(' ')[0]; 
    const horaInicioStr = turno.fecha_hora_inicio.substring(11, 16); 
    const capaTurnos = document.getElementById(`capa-turnos-${fechaPart}`);
    
    if (capaTurnos) {
        const pxPorMinuto = 80 / 60;
        const [horaT, minT] = horaInicioStr.split(':').map(Number);
        
        const minutosDesdeInicioDia = (horaT * 60 + minT) - 450;
        const topPx = minutosDesdeInicioDia * pxPorMinuto;
        const heightPx = turno.duracion_bloque * pxPorMinuto;

        const divTurno = document.createElement('div');
        divTurno.className = `turno-gantt ${turno.es_sobreturno == 1 ? 'es-sobreturno' : 'normal'}`;
        divTurno.style.top = `${topPx}px`;
        divTurno.style.height = `${heightPx}px`;
        divTurno.style.backgroundColor = colorFondo;

        divTurno.innerHTML = `
            <strong>${turno.nombre_clienta} ${turno.apellido_clienta}</strong>
            <span>${horaInicioStr}hs - ${turno.servicio_principal} (${turno.duracion_bloque}m)</span>
            ${turno.es_sobreturno == 1 ? '<span style="font-weight:bold; font-size: 0.7rem; margin-top:auto;">SOBRETURNO</span>' : ''}
        `;

        divTurno.addEventListener('click', (e) => {
            e.stopPropagation(); 
            let bloqueBase = "07:30";
            if (horaT >= 10 && horaT < 13) bloqueBase = "10:30";
            if (horaT >= 13) bloqueBase = "13:30";
            
            abrirModal(null, bloqueBase, fechaPart);
        });

        capaTurnos.appendChild(divTurno);
    }
}

function abrirModal(dia, bloqueBase, fechaExacta) {
    const modal = document.getElementById('modal-turno');
    const selectHora = document.getElementById('hora-inicio-turno');
    
    document.getElementById('fecha-turno-oculta').value = fechaExacta;
    
    selectHora.innerHTML = '';
    let [hora, min] = bloqueBase.split(':').map(Number);
    
    for (let i = 0; i < 6; i++) { 
        const horaStr = hora.toString().padStart(2, '0');
        const minStr = min.toString().padStart(2, '0');
        const opcionHora = `${horaStr}:${minStr}`;
        
        if (hora >= 16 && min > 0) break;
        
        selectHora.innerHTML += `<option value="${opcionHora}">${opcionHora} hs</option>`;
        
        min += 30;
        if (min >= 60) {
            min = 0;
            hora++;
        }
    }
    
    document.getElementById('id-clienta-seleccionada').value = "";
    document.getElementById('buscador-clienta').value = "";
    document.getElementById('campos-nueva-clienta').style.display = 'none';
    
    modal.classList.remove('modal-oculto');
    modal.classList.add('modal-visible');
}

function cerrarModal() {
    const modal = document.getElementById('modal-turno');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-oculto');
    document.getElementById('form-nuevo-turno').reset();
}