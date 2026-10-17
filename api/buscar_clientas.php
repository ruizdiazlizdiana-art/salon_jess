<?php
// api/buscar_clientas.php
header('Content-Type: application/json');
require '../conexion.php';

// Recibimos el texto ingresado en el buscador
$termino = isset($_GET['q']) ? $_GET['q'] : '';

// Si escriben menos de 2 caracteres, no buscamos para no saturar la base de datos
if (strlen($termino) < 2) {
    echo json_encode(["exito" => true, "clientas" => []]);
    exit;
}

try {
    // Buscamos coincidencias parciales en nombre, apellido o teléfono
    $sql = "SELECT id_clienta, nombre, apellido, telefono 
            FROM clientas 
            WHERE nombre LIKE :termino 
               OR apellido LIKE :termino 
               OR telefono LIKE :termino 
            LIMIT 10";
            
    $stmt = $conexion->prepare($sql);
    // Añadimos los % para que busque el texto en cualquier parte de la palabra
    $stmt->execute([':termino' => '%' . $termino . '%']);
    
    $clientas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["exito" => true, "clientas" => $clientas]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error en la búsqueda: " . $e->getMessage()]);
}
?>