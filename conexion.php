<?php
// conexion.php
$host = "localhost";
$usuario = "root"; // Usuario por defecto en XAMPP
$contrasena = "";  // En XAMPP suele estar vacío
$base_de_datos = "jess_salon"; // El nombre de la BD que creaste en phpMyAdmin

try {
    // Usamos PDO para mayor seguridad y evitar inyecciones SQL
    $conexion = new PDO("mysql:host=$host;dbname=$base_de_datos;charset=utf8", $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["exito" => false, "mensaje" => "Error de conexión a la base de datos: " . $e->getMessage()]));
}
?>