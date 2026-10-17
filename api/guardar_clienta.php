<?php
// api/guardar_clienta.php
header('Content-Type: application/json');
require '../conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    try {
        $nombre = $datos['nombre'];
        $apellido = $datos['apellido'];
        $telefono = $datos['telefono'];
        // Los campos formula_color y observaciones pueden quedar vacíos al crear
        
        $sql = "INSERT INTO clientas (nombre, apellido, telefono) VALUES (:nombre, :apellido, :telefono)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':apellido' => $apellido,
            ':telefono' => $telefono
        ]);
        
        // Obtenemos el ID de la clienta recién insertada
        $idNuevaClienta = $conexion->lastInsertId();
        
        echo json_encode([
            "exito" => true, 
            "mensaje" => "Clienta registrada", 
            "id_clienta" => $idNuevaClienta,
            "nombre_completo" => $nombre . " " . $apellido
        ]);

    } catch (PDOException $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error al guardar clienta: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "No se recibieron datos."]);
}
?>