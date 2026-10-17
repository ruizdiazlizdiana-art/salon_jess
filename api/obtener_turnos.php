<?php
// api/obtener_turnos.php
header('Content-Type: application/json');
require '../conexion.php';

try {
    // Agregamos t.id_profesional a la consulta para el panel global
    $sql = "SELECT 
                t.id_turno,
                t.id_profesional, 
                t.fecha_hora_inicio,
                t.duracion_bloque,
                t.servicio_principal,
                t.es_sobreturno,
                c.nombre AS nombre_clienta,
                c.apellido AS apellido_clienta
            FROM turnos t
            JOIN clientas c ON t.id_clienta = c.id_clienta
            WHERE t.estado_turno = 'Activo'
            ORDER BY t.fecha_hora_inicio ASC";
            
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    
    $turnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["exito" => true, "turnos" => $turnos]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al obtener los turnos: " . $e->getMessage()]);
}
?>