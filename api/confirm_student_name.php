<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root"; // todo: replace in production
$password = ""; // todo: replace in production
$dbname = "dumsa_main"; // Change to your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name']) || !isset($data['class'])) {
        echo json_encode(["status" => false, "message" => "Invalid input"]);
        exit();
    }

    $name = $data['name'];
    $class = $data['class'];

    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("SELECT name FROM students WHERE level = ?");
    $stmt->bind_param("s", $class);

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();

    $matches = [];
    while ($row = $result->fetch_assoc()) {
        $student_name = $row['name'];
        if (stripos($student_name, $name) !== false) {
            $matches[] = $student_name;
        }
    }

    // Return the matches as a JSON response
    echo json_encode(["status" => true, "matches" => $matches]);

    // Close the connection
    $stmt->close();
    $conn->close();
}
?>
