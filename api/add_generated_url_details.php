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

    // Check if the necessary parameters are set
    $required_params = ['email', 'amount', 'reference', 'callback', 'user_hash', 'name', 'level', 'transaction_date', 'access_code'];
    $missing_params = [];

    foreach ($required_params as $param) {
        if (!isset($input[$param])) {
            $missing_params[] = $param;
        }
    }

    if (empty($missing_params)) {
        $email = $input['email'];
        $amount = $input['amount'];
        $reference = $input['reference'];
        $callback = $input['callback'];
        $name = $input['name'];
        $name = strtoupper($name);
        $crc32Hash = crc32($name);
        $user_hash = $crc32Hash;
        $level = $input['level'];
        $transaction_date = $input['transaction_date'];
        $access_code = $input['access_code'];

        // Prepare the SQL statement
        $stmt = $conn->prepare("INSERT INTO init_transactions (email, amount, reference, callback, user_hash, name, level, transaction_date, access_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sissssiss", $email, $amount, $reference, $callback, $user_hash, $name, $level, $transaction_date, $access_code);

        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(['status' => true, 'message' => 'Data inserted successfully']);
        } else {
            echo json_encode(['status' => false, 'message' => 'Data insertion failed: ' . $stmt->error]);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['status' => false, 'message' => 'Missing required parameters', 'missing_params' => $missing_params]);
    }

    // Close the connection
    $conn->close();
} else {
    echo json_encode(['status' => false, 'message' => 'Invalid request method']);
}
?>
