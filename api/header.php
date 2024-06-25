<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'dumsa_main';
$database_connection = mysqli_connect($host, $user, $password, $database);
if (!$database_connection) {
    $response = array('success' => false, 'message' => 'Connection failed: ' . $database_connection->connect_error);
    echo json_encode($response);
    exit();
}

$conn = $database_connection;

