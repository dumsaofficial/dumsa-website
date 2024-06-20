<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$servername = "localhost";
$username = "root"; // todo: replace in production
$password = ""; // todo: replace in production
$dbname = "dumsa_main"; // your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Fetch data from the table
$sql = "SELECT s_id, key_, value_, additional_value FROM dumsa_key_values";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(['status' => true, 'data' => $data]);
} else {
    echo json_encode(['status' => false, 'message' => 'No data found']);
}

// Close the connection
$conn->close();
?>
