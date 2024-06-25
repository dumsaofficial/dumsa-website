<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Initialize Dompdf options
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isFontSubsettingEnabled', true);

$dompdf = new Dompdf($options);
$imagePath = 'https://www.dumsa.org/api/dumsa_logo_unfazed.png';

// Read image data
$imageData = file_get_contents($imagePath);

// Encode image data to base64
$base64Image = 'data:image/png;base64,' . base64_encode($imageData);
$data = json_decode(file_get_contents('php://input'), true);

// Define your variables
$date = date('Y-m-d');
$name = $data['name'];
$sessionPaid = $data['sessionPaid'];
$amountPaid = $data['amountPaid'];
$reference = $data['reference'];
$president = "MUEMUIFO GIDEON KANE";
$secretaryGeneral = "KUBEINJE ROTACHI";

// Load HTML content
$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DUMSA Dues e-Receipt</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DejaVu+Sans&display=swap');
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #000;
        }
        .header {
            text-align: center;
        }
        .header img {
            width: 80px;
            height: auto;
        }
        .header h1 {
            font-size: 24px;
            margin: 10px 0;
        }
        .header p {
            margin: 5px 0;
        }
        .receipt-title {
            text-align: center;
            font-size: 20px;
            margin: 20px 0;
            font-weight: bold;
        }
        .details {
            margin: 20px 0;
        }
        .details p {
            font-size: 16px;
            margin: 5px 0;
        }
        .details .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        .certify {
            margin: 20px 0;
            font-size: 14px;
            text-align: center;
        }
        .certify a {
            color: #000;
            text-decoration: none;
            font-weight: bold;
        }
        .signatures {
            margin-top: 30px;    
        }
        .signatures .signature {
            text-align: center;
        }
        .signature {
            display: inline-block;
            margin-right: 140px; /* Adjust the value for desired spacing */
        }
         .signaturel {
            display: inline-block;
            margin-left: 140px; /* Adjust the value for desired spacing */
        }
        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 2px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <img src="$base64Image" alt="Your Image">
        <h1>DELTA STATE UNIVERSITY MEDICAL STUDENTS ASSOCIATION</h1>
        <p>ABRAKA, DELTA STATE, NIGERIA</p>
        <p>E-mail: <a href="mailto:dumsa.official@gmail.com">dumsa.official@gmail.com</a></p>
        <p>MOTTO: Ad Spem Servandam</p>
    </div>
    <div class="receipt-title">
        DUMSA DUES e-Receipt
    </div>
    <div class="details">
        <p><span class="label">NAME:</span> $name</p>
        <p><span class="label">SESSION PAID:</span> $sessionPaid</p>
        <p><span class="label">AMOUNT PAID:</span> $amountPaid</p>
        <p><span class="label">REF:</span> $reference</strong></p>
        <p><span class="label">DATE:</span> $date</p>
    </div>
    <div class="certify">
        <p>This is to certify that $name paid the DUMSA dues for the $sessionPaid session. Please grant him/her due recognition.</p>
        <p>If this paper is not stamped with the DUMSA seal, please visit <a style="color: #0a24ca" href="http://www.dumsa.org/dues/$reference">www.dumsa.org/dues/$reference</a> for verification.</p>
    </div>
    <div class="signatures">
        <div class="signature">
            <p>__________________________</p>
            <p>$president</p>
            <p>PRESIDENT</p>
        </div>
        <div class="signaturel">
            <p>__________________________</p>
            <p>$secretaryGeneral</p>
            <p>SECRETARY GENERAL</p>
        </div>
    </div>
    <div class="footer">
        <p>THE SECRETARIAT:</p>
        <p>DELTA STATE UNIVERSITY TEACHING HOSPITAL, OGHARA</p>
        <p>DELTA STATE, NIGERIA</p>
    </div>
</div>
</body>
</html>
HTML;

$dompdf->loadHtml($html);

// Set paper size to auto
$customPaper = array(0, 0, 710, 710);
$dompdf->setPaper($customPaper);

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream("receipt_$reference.pdf", array("Attachment" => false));
?>
