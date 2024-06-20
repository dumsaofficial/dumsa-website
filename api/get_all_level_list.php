<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "dumsa_main"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

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
