<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = ""; // Your database connection details here
require 'header.php';

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
