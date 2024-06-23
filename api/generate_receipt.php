<?php
require 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Initialize dompdf without specific options
$dompdf = new Dompdf();
$imagePath = 'https://www.dumsa.org/api/dumsa_logo_unfazed.png';

// Read image data
$imageData = file_get_contents($imagePath);


// Encode image data to base64
$base64Image = 'data:image/png;base64,' . base64_encode($imageData);

// Load HTML content
$html = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DUMSA Dues e-Receipt</title>
    <style>
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
            display: flex;
            justify-content: space-between;
            margin: 40px 0 20px;
        }
        .signatures .signature {
            text-align: center;
        }
        .signatures .signature p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <img src="' . $base64Image . '" alt="Your Image">
        <h1>DELTA STATE UNIVERSITY MEDICAL STUDENTS ASSOCIATION</h1>
        <p>ABRAKA, DELTA STATE, NIGERIA</p>
        <p>E-mail: <a href="mailto:dumsa.official@gmail.com">dumsa.official@gmail.com</a></p>
        <p>MOTTO: Ad Spem Servandam</p>
    </div>
    <div class="receipt-title">
        DUMSA DUES e-Receipt
    </div>
    <div class="details">
        <p><span class="label">NAME:</span> [NAME]</p>
        <p><span class="label">SESSION PAID:</span> [SESSION PAID]</p>
        <p><span class="label">AMOUNT PAID:</span> [AMOUNT PAID]</p>
        <p><span class="label">REF:</span> [REFERENCE]</p>
        <p><span class="label">DATE:</span> [DATE]</p>
    </div>
    <div class="certify">
        <p>This is to certify that [NAME] paid the DUMSA dues for the [SESSION PAID] session. Please grant him/her due recognition. If this paper is not stamped with the DUMSA seal,</p>
        <p>please visit <a href="http://www.dumsa.org/dues/[REFERENCE]">www.dumsa.org/dues/[REFERENCE]</a> for verification.</p>
    </div>
    <div class="signatures">
        <div class="signature">
            <p>__________________________</p>
            <p>MUEMUIFO GIDEON KANE</p>
            <p>PRESIDENT</p>
        </div>
        <div class="signature">
            <p>__________________________</p>
            <p>KUBEINJE ROTACHI</p>
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
';

$dompdf->loadHtml($html);

$dompdf->loadHtml($html);

$customPaper = array(0,0,900,960);
$dompdf->setPaper($customPaper);

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream("sample.pdf", array("Attachment" => false));

