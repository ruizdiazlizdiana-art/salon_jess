<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda Jess Salón</title>
    <!-- Enlace a nuestra hoja de estilos -->
    <link rel="stylesheet" href="assets/css/estilos.css">
</head>
<body>
    <div class="mobile-container">
        
        <!-- MINIMAPA FIJO ARRIBA -->
        <header class="minimapa">
            <h2 id="mes-actual-titulo">...</h2> 
            <div class="dias-grid" id="contenedor-minimapa"></div>
        </header>

        <!-- AGENDA INFINITA EN CASCADA -->
        <main class="agenda-infinita" id="contenedor-agenda">
            <!-- Los días se generarán aquí mediante JavaScript -->
        </main>

    </div>

<!-- MODAL DE CARGA RÁPIDA DE TURNO -->
    <div id="modal-turno" class="modal-oculto">
        <div class="modal-contenido">
            <div class="modal-header">
                <h3>Nuevo Turno</h3>
                <button type="button" onclick="cerrarModal()" class="btn-cerrar">X</button>
            </div>
            
            <!-- FORMULARIO CORREGIDO (Solo 1 etiqueta form) -->
            <form id="form-nuevo-turno">
                
                <!-- CAMPOS OCULTOS VITALES PARA EL BACKEND -->
                <input type="hidden" id="id-clienta-seleccionada" value=""> 
                <input type="hidden" id="fecha-turno-oculta" value="">

                <!-- Hora Exacta -->
                <label>Hora de Inicio</label>
                <select id="hora-inicio-turno" required style="margin-bottom: 10px;">
                    <!-- Se llena con JS -->
                </select>                
                <!-- Buscador de Clienta -->
                <label>Clienta</label>
                <div class="buscador-layout">
                    <input type="text" id="buscador-clienta" placeholder="Buscar clienta...">
                    <button type="button" id="btn-nueva-clienta" class="btn-accion">+ Nueva</button>
                </div>
                
                <ul id="lista-resultados-clientas" style="display: none;"></ul>

                <!-- Campos para Nueva Clienta (Ocultos por defecto) -->
                <div id="campos-nueva-clienta" style="display: none;">
                    <h4>Registrar Nueva Clienta</h4>
                    <label>Nombre *</label>
                    <input type="text" id="nuevo-nombre" placeholder="Nombre">
                    <label>Apellido *</label>
                    <input type="text" id="nuevo-apellido" placeholder="Apellido">
                    <label>Teléfono *</label>
                    <input type="text" id="nuevo-telefono" placeholder="Ej: +541123456789">
                    
                    <button type="button" id="btn-guardar-clienta">Guardar y Seleccionar</button>
                </div>

                <!-- Servicio Principal -->
                <label>Servicio</label>
                <select id="servicio-principal" required>
                    <option value="">Seleccionar tratamiento...</option>
                    <option value="C">Color / Mechas (Mín. 4hs)</option>
                    <option value="K">Keratina (2 a 2.5hs)</option>
                    <option value="R">Raíces (1 a 1.5hs)</option>
                    <option value="BL">Baño de luz (2hs)</option>
                    <option value="PP">Lifting de pestañas (1.5hs)</option>
                    <option value="A">Alisado (1h)</option>
                    <option value="T">Tintura (2hs)</option>
                </select>

                <!-- Duración del Bloque -->
                <label>Duración</label>
                <select id="duracion-bloque" required>
                    <option value="60">1 Hora</option>
                    <option value="90">1 Hora 30 Minutos</option>
                    <option value="120">2 Horas</option>
                    <option value="180">3 Horas</option>
                    <option value="240">4 Horas</option>
                    <option value="300">5 Horas</option>
                    <option value="360">6 Horas</option>
                    <option value="420">7 Horas</option>
                    <option value="480">8 Horas</option>
                </select>

                <!-- Interruptor de Sobreturno ELIMINADO visualmente, lo maneja JS -->
                <input type="hidden" id="es-sobreturno" value="false">

                <!-- Interruptor de Sobreturno -->
                <div class="toggle-container">
                    <label for="es-sobreturno">¿Es Sobreturno?</label>
                    <input type="checkbox" id="es-sobreturno">
                </div>

                <!-- Observaciones -->
                <label>Observaciones (Opcional)</label>
                <input type="text" id="observaciones" placeholder="Ej. Trae extensiones, viene con amiga...">

                <button type="submit" class="btn-guardar">Agendar Turno</button>
            </form>
        </div>
    </div>
    
    <!-- Enlaces a los scripts -->
    <script src="assets/js/minimapa.js"></script>
   <script src="assets/js/agenda.js?v=2.0"></script>

</body>
</html>