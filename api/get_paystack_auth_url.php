<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // Ensure the response is in JSON format

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
// Get the JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
// Check if the necessary parameters are set
    if (isset($input['email']) && isset($input['callback_url'])) {
        $email = $input['email'];
        $amount = $input['amount'];
        $callback_url = $input['callback_url'];
        $cancel_action = isset($input['cancel_action']) ? $input['cancel_action'] : '';
        $url = "https://api.paystack.co/transaction/initialize";
        $fields = [
            'email' => $email,
            'amount' => $amount,
            'callback_url' => $callback_url,
            'metadata' => ["cancel_action" => $cancel_action]
        ];
        $fields_string = http_build_query($fields);
        // Open connection
        $ch = curl_init();
        // Set the URL, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
           // "Authorization: Bearer sk_live_4f664898f980a7d1ae1f369ad42841d877729130", // Replace SECRET_KEY with your actual secret key
            "Authorization: Bearer sk_test_5c807c53d3ca0327a4d516abb3e3f194000d385f", // Replace SECRET_KEY with your actual secret key
            "Cache-Control: no-cache",
        ));

        // So that curl_exec returns the contents of the cURL; rather than echoing it
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute post
        $result = curl_exec($ch);
        // Close cURL session
        curl_close($ch);
        // Output result
        echo $result;
    } else {
        // Return error response if required parameters are missing
        http_response_code(400);
        echo json_encode(["error" => "Missing required parameters"]);
    }
}
?>
