<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['reference'])) {
    // Append the reference value to the Paystack endpoint
    $reference = $data['reference'];
    $paystackEndpoint = "https://api.paystack.co/transaction/verify/$reference";

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $paystackEndpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            //"Authorization: Bearer sk_live_4f664898f980a7d1ae1f369ad42841d877729130",
                "Authorization: Bearer sk_test_5c807c53d3ca0327a4d516abb3e3f194000d385f",
            "Cache-Control: no-cache",
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
} else {
    echo "Reference not provided";
}
?>
