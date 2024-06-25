<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = ""; // Your database connection details here
require 'header.php';


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Query to get unique classes
    $sql = "SELECT DISTINCT level FROM students";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $classes = [];
        while ($row = $result->fetch_assoc()) {
            $classes[] = $row['level'];
        }
        echo json_encode(['status' => true, 'data' => $classes]);
    } else {
        echo json_encode(['status' => false, 'message' => 'No classes found']);
    }

    // Close the connection
    $conn->close();
}
?>
