// admin.js

const profesionales = [
    { id: 1, nombre: "Jess" },
    { id: 3, nombre: "Andrea" },
    { id: 4, nombre: "Laila" },
    { id: 5, nombre: "Sophie" },
    { id: 6, nombre: "Maia" },
    { id: 7, nombre: "Maby" } // Trabaja los sábados[cite: 5]
];

// Colores distintivos para cada columna/profesional
const coloresTurnos = ['#20c997', '#0dcaf0', '#6f42c1', '#d63384', '#fd7e14', '#198754'];

// Variable global para almacenar todos los turnos y evitar superposiciones
let turnosCargadosGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Generamos el tablero base
    generarCalendarioGlobal();
    // 2. Cargamos los turnos de las 6 profesionales[cite: 6]
    cargarTurnosGlobales();
});

function generarCalendarioGlobal() {
    const contenedorAgenda = document.getElementById('contenedor-agenda-global');
    contenedorAgenda.innerHTML = ''; 

    const fechaInicial = new Date(); 
    fechaInicial.setHours(0, 0, 0, 0);
    const diasGenerar = 90; 
    
    const nombresDiasCompletos = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    // Filtro base: Jueves, Viernes, Sábado[cite: 5]
    let diasLaborables = [4, 5, 6]; 

    // Bloques base de la agenda física (7:30, 10:30, 13:30)[cite: 5, 6]
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
            const nombreMes = nombresMeses[fechaActual.getMonth()]; 
            
            const anio = fechaActual.getFullYear();
            const mesStr = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const diaStr = String(numDia).padStart(2, '0');
            const fechaString = `${anio}-${mesStr}-${diaStr}`; 
            
            const diaWrapper = document.createElement('section');
            diaWrapper.className = 'dia-global-wrapper';
            
            diaWrapper.innerHTML = `
                <div class="dia-global-header">
                    <h3>${nombreCompleto} ${numDia} de ${nombreMes}</h3>
                </div>
            `;

            const grillaScroll = document.createElement('div');
            grillaScroll.className = 'grilla-profesionales-scroll';

            profesionales.forEach((prof, index) => {
                const columna = document.createElement('div');
                columna.className = 'columna-profesional';
                
                columna.innerHTML = `<div class="nombre-profesional" style="border-top: 4px solid ${coloresTurnos[index]};">${prof.nombre}</div>`;
                
                const ganttContainer = document.createElement('div');
                ganttContainer.className = 'dia-gantt-container';
                ganttContainer.style.marginTop = '0'; 
                ganttContainer.style.border = 'none';
                
                bloquesHorarios.forEach(bloque => {
                    const fila = document.createElement('div');
                    fila.className = 'fila-fondo';
                    fila.innerHTML = `
                        <div class="hora-etiqueta">${bloque.texto}</div>
                        <div class="espacio-clic-fondo"></div>
                    `;
                    ganttContainer.appendChild(fila);
                });

                const capaTurnos = document.createElement('div');
                capaTurnos.className = 'capa-turnos';
                // ID vital para saber en qué columna y día pintar el turno
                capaTurnos.id = `capa-${fechaString}-prof-${prof.id}`; 
                
                ganttContainer.appendChild(capaTurnos);
                columna.appendChild(ganttContainer);
                grillaScroll.appendChild(columna);
            });

            diaWrapper.appendChild(grillaScroll);
            contenedorAgenda.appendChild(diaWrapper);
        }
    }
}

// Función asíncrona (Fetch) para consultar la base de datos[cite: 5]
async function cargarTurnosGlobales() {
    try {
        const respuesta = await fetch('api/obtener_turnos.php');
        const resultado = await respuesta.json();
        
        document.querySelectorAll('.capa-turnos').forEach(capa => capa.innerHTML = '');

        if (resultado.exito) {
            turnosCargadosGlobal = resultado.turnos;
            
            resultado.turnos.forEach(turno => {
                // Selecciona el color de la profesional según su ID
                const colorFondo = coloresTurnos[(turno.id_profesional - 1) % coloresTurnos.length];
                pintarTurnoEnAdmin(turno, colorFondo);
            });
        }
    } catch (error) {
        console.error("Error al cargar los turnos globales:", error);
    }
}

function pintarTurnoEnAdmin(turno, colorFondo) {
    const fechaPart = turno.fecha_hora_inicio.split(' ')[0]; 
    const horaInicioStr = turno.fecha_hora_inicio.substring(11, 16); 
    
    // Buscar el contenedor específico: "capa-[fecha]-prof-[id_profesional]"
    const capaTurnos = document.getElementById(`capa-${fechaPart}-prof-${turno.id_profesional}`);
    
    if (capaTurnos) {
        const pxPorMinuto = 80 / 60; // 1 hora = 80px
        const [horaT, minT] = horaInicioStr.split(':').map(Number);
        
        const minutosDesdeInicioDia = (horaT * 60 + minT) - 450; // Inicia a las 07:30
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

        capaTurnos.appendChild(divTurno);
    }
}

// Función básica para evitar errores si tocan un botón de cierre
function cerrarModal() {
    const modal = document.getElementById('modal-turno');
    if (modal) {
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-oculto');
    }
}