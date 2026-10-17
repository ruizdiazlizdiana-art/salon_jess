// minimapa.js

// Variable global para guardar el mes actual en vista
let mesEnVista = ""; 

document.addEventListener('DOMContentLoaded', () => {
    generarMinimapa();
});

function generarMinimapa() {
    const contenedorMinimapa = document.getElementById('contenedor-minimapa');
    const tituloMes = document.getElementById('mes-actual-titulo');
    contenedorMinimapa.innerHTML = ''; 

    // OBTENEMOS LA FECHA DE HOY (Dinámico)
    const fechaInicial = new Date(); 
    // Aseguramos que arranque a las 00:00:00 para no tener problemas con horas
    fechaInicial.setHours(0, 0, 0, 0); 
    
    const diasGenerar = 90; // 3 meses[cite: 4]
    
    const nombresDiasCortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const nombresDiasCompletos = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Filtramos los días laborables (Jueves 4, Viernes 5, Sábado 6)[cite: 4]
    const diasLaborables = [4, 5, 6]; 

    // Establecemos el título inicial con el mes y año de HOY
    tituloMes.innerText = `${nombresMeses[fechaInicial.getMonth()]} ${fechaInicial.getFullYear()}`;

    for (let i = 0; i < diasGenerar; i++) {
        const fechaActual = new Date(fechaInicial);
        fechaActual.setDate(fechaInicial.getDate() + i);

        const diaSemanaNum = fechaActual.getDay();

        if (diasLaborables.includes(diaSemanaNum)) {
            const numDia = fechaActual.getDate();
            const nombreCorto = nombresDiasCortos[diaSemanaNum];
            const nombreCompleto = nombresDiasCompletos[diaSemanaNum];
            
            const idDiaDestino = `${nombreCompleto}-${numDia}`;

            const divDia = document.createElement('div');
            divDia.className = 'dia';
            
            divDia.onclick = () => scrollToDay(idDiaDestino);
            
            divDia.innerHTML = `
                <span class="dia-nombre-corto">${nombreCorto}</span>
                <span class="dia-numero">${numDia}</span>
                <span class="dot verde"></span>
            `;
            
            contenedorMinimapa.appendChild(divDia);
        }
    }
}

function scrollToDay(dayId) {
    const diaElemento = document.getElementById(dayId);
    
    if (diaElemento) {
        const minimapaHeight = document.querySelector('.minimapa').offsetHeight;
        const elementoPosition = diaElemento.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementoPosition - minimapaHeight - 10;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}