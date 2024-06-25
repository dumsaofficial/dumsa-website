<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // Ensure the response is in JSON format

$conn = ""; // Your database connection details here
require 'header.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Check if the necessary parameter is set
    if (isset($input['reference'])) {
        $reference = $input['reference'];

        // Prepare the SQL statement
        $stmt = $conn->prepare("SELECT * FROM init_transactions WHERE reference = ?");
        $stmt->bind_param("s", $reference);
        // Execute the statement
        if ($stmt->execute()) {
            // Get the result
            $result = $stmt->get_result();
            // Check if any row is returned
            if ($result->num_rows > 0) {
                // Fetch the row as an associative array
                $row = $result->fetch_assoc();
                echo json_encode(['status' => true, 'data' => $row]);
            } else {
                echo json_encode(['status' => false, 'message' => 'No record found']);
            }
        } else {
            echo json_encode(['status' => false, 'message' => 'Query execution failed: ' . $stmt->error]);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['status' => false, 'message' => 'Missing required parameter: reference']);
    }

    // Close the connection
    $conn->close();
} else {
    echo json_encode(['status' => false, 'message' => 'Invalid request method']);
}
?>
