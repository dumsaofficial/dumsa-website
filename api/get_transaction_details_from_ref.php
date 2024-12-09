<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // Ensure the response is in JSON format

$conn = ""; // Your database connection details here
require 'header.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Initialize an empty response array
    $response = ['status' => false, 'message' => ''];

    // Get the JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Check if the necessary parameter is set
    if (isset($input['reference'])) {
        $reference = $input['reference'];

        // Prepare the SQL statement to fetch all rows
        $stmt = $conn->prepare("SELECT * FROM init_transactions");

        // Execute the statement
        if ($stmt->execute()) {
            // Get the result
            $result = $stmt->get_result();
            // Initialize an array to store all rows
            $transactions = [];

            // Fetch all rows and store them in $transactions array
            while ($row = $result->fetch_assoc()) {
                $transactions[] = $row;
            }

            // Check if any row is returned
            if (!empty($transactions)) {
                // Search for the matching reference in $transactions array
                $found = false;
                foreach ($transactions as $transaction) {
                    if ($transaction['reference'] == $reference) {
                        $response = ['status' => true, 'data' => $transaction];
                        $found = true;
                        break; // Exit the loop once found
                    }
                }

                if (!$found) {
                    $response = ['status' => false, 'message' => 'No record found for ' . $reference];
                }
            } else {
                $response = ['status' => false, 'message' => 'No records found in the database'];
            }
        } else {
            $response = ['status' => false, 'message' => 'Query execution failed: ' . $stmt->error];
        }

        // Close the statement
        $stmt->close();
    } else {
        $response = ['status' => false, 'message' => 'Missing required parameter: reference'];
    }

    // Close the connection
    $conn->close();

    // Output the JSON response
    echo json_encode($response);
} else {
    echo json_encode(['status' => false, 'message' => 'Invalid request method']);
}
?>
