<?php
// api/guardar_turno.php

// 1. Configuramos las cabeceras para aceptar JSON (necesario para fetch)
header('Content-Type: application/json');

// 2. Incluimos el archivo de conexión a la base de datos que creaste antes
// Asegúrate de que la ruta sea correcta según dónde esté tu archivo conexion.php
require '../conexion.php'; 

// 3. Recibimos los datos crudos que envía el JavaScript a través de la petición Fetch
$datosCrudos = file_get_contents("php://input");

// 4. Decodificamos el JSON recibido para convertirlo en un array asociativo de PHP
$datos = json_decode($datosCrudos, true);

// 5. Verificamos si realmente se recibieron datos
if ($datos) {
    try {
        // En un entorno real, el id_profesional vendría de la sesión activa (ej. la profesional logueada).
        // Por ahora, como estamos probando, forzaremos los IDs.
        $id_clienta = isset($datos['id_clienta']) ? $datos['id_clienta'] : 1; 
        $id_profesional = 1; // Supongamos que es Jess la que está logueada
        
        // Asignamos las variables extrayéndolas del array $datos
        $fecha_hora_inicio = $datos['fecha_hora']; // Ej: "2026-08-25 08:00:00"
        $duracion_bloque = $datos['duracion_bloque']; // Intervalos de 30, 60, 90...
        $servicio_principal = $datos['servicio_principal']; // C, K, R, etc.
        // Convertimos el valor booleano de JavaScript (true/false) a un entero (1/0) para MySQL
        $es_sobreturno = !empty($datos['es_sobreturno']) ? 1 : 0; 
        $observaciones = isset($datos['observaciones']) ? $datos['observaciones'] : '';

        // 6. Preparamos la consulta SQL para insertar el turno
        $sql = "INSERT INTO turnos (id_clienta, id_profesional, fecha_hora_inicio, duracion_bloque, servicio_principal, es_sobreturno, observaciones) 
                VALUES (:id_clienta, :id_profesional, :fecha_hora_inicio, :duracion_bloque, :servicio_principal, :es_sobreturno, :observaciones)";
        
        $stmt = $conexion->prepare($sql);
        
        // 7. Ejecutamos la consulta, pasando los valores a los marcadores
        $stmt->execute([
            ':id_clienta' => $id_clienta,
            ':id_profesional' => $id_profesional,
            ':fecha_hora_inicio' => $fecha_hora_inicio,
            ':duracion_bloque' => $duracion_bloque,
            ':servicio_principal' => $servicio_principal,
            ':es_sobreturno' => $es_sobreturno,
            ':observaciones' => $observaciones
        ]);

        // 8. Si todo sale bien, respondemos al frontend (JavaScript) con un mensaje de éxito
        echo json_encode(["exito" => true, "mensaje" => "Turno agendado correctamente en XAMPP."]);

    } catch (PDOException $e) {
        // Si hay un error en la base de datos, lo capturamos y devolvemos un mensaje
        echo json_encode(["exito" => false, "mensaje" => "Error al guardar el turno en la BD: " . $e->getMessage()]);
    }
} else {
    // Si no se recibieron datos válidos
    echo json_encode(["exito" => false, "mensaje" => "No se recibieron datos desde el formulario."]);
}
?>