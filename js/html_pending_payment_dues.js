console.log("Pending payment script loaded");

const home_url = base + "/api/";
const verify_transact_url = home_url + "verify_paystack_payment.php";
const receipt_url = home_url + "generate_receipt.php"; // URL to your receipt generation endpoint
let percent_progress = 0;
let max_percent = 30;
let timeout = 150; // in milliseconds
const transaction_details_url = home_url + "get_transaction_details_from_ref.php"; // New endpoint to get transaction details
let downloaded= false;

verifyTransaction();

// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const trxref = params.get('trxref');
    const reference = params.get('reference');
    console.log("ref is " + trxref + " <> " + reference);
    return { trxref, reference };
}

// Function to start the countdown
function startCountdown() {
    // Implement the countdown logic if needed
}

// Function to change the maximum percentage
function change_max_percent(number) {
    max_percent = number;
}

// Function to change the rate of increase
function change_rate_increase(number) {
    timeout = number;
}

// Function to handle transaction result
function transactionResult(status, transactionDetails) {
    if (status) {
        console.log("Transaction Successful");
        downloaded = true;
        change_max_percent(100);
        change_rate_increase(1);
        changeMessage("Payment Successful, Thank you");
        changeSubMessage("Click the button below to download your receipt.");
        showDownloadButton(transactionDetails);
    }
}

function fetchTransactionDetails(reference) {
    console.log(reference)
    return fetch(transaction_details_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({reference: reference })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.status) {
                console.log(data)
                return data.data; // Assuming the response contains the transaction details under 'data'
            } else {
                throw new Error('Failed to fetch transaction details');
            }
        })
        .catch(error => {
            console.error('Error fetching transaction details:', error);
            throw error;
        });
}

// Function to verify the transaction
function verifyTransaction() {
    const { trxref, reference } = getQueryParams();
    if (trxref && reference) {
        console.log(`Verifying transaction with trxref: ${trxref} and reference: ${reference}`);
        progressivelyIncreaseRate();
        startCountdown();
        fetch(verify_transact_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trxref, reference })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status) { // Note: This is the status of the API call, not the transaction status
                    if(data.data.status === "success"){

                        fetchTransactionDetails(data.data.reference)
                            .then(data => {
                                console.log(data);
                                const transactionDetails = {
                                    name: data.name,
                                    amount: data.amount,
                                    reference: data.reference
                                };
                                transactionResult(true, transactionDetails);
                            })
                    }

                }
            })
            .catch(error => {
                console.error('Error verifying transaction:', error);
            });
    } else {
        console.error('Transaction reference or reference is missing');
        // Handle appropriately (e.g., show an error message to the user)
    }
    console.log("Waiting for fetch");
}

// Function to change progress text
function changeProgressText(percentage_increase) {
    if (percent_progress > max_percent) {
        percent_progress--; // Decrement to correct overflow
        percentage_increase = percent_progress;
    }
    document.getElementById('progress-text').innerText = `${percentage_increase}%`;
}

// Function to progressively increase the rate
function progressivelyIncreaseRate() {
    changeProgressText(percent_progress++);
    setTimeout(progressivelyIncreaseRate, timeout);
}

// Function to change the main message
function changeMessage(text) {
    document.getElementById('message').innerText = text;
}

// Function to change the sub-message
function changeSubMessage(text) {
    document.getElementById('sub-message').innerText = text;
}

// Function to show the download button
function showDownloadButton(transactionDetails) {

    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
        if(downloaded){
            downloadReceipt(transactionDetails);
        }
    });
}

// Function to download the receipt
function downloadReceipt(transactionDetails) {
    changeMessage("Generating Receipt");
    const payload = {
        name: transactionDetails.name,
        amountPaid: transactionDetails.amount,
        sessionPaid: "2023/2024", // TODO: Fetch this from the database if necessary
        reference: transactionDetails.reference
    };
    console.log(payload);

    fetch(receipt_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `receipt_${transactionDetails.reference}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log('Receipt downloaded successfully');
            changeMessage("Receipt downloaded successfully");
            changeSubMessage("You can now go to home");
        })
        .catch(error => {
            console.error('Error downloading receipt:', error);
        });
}

// Function to navigate to the home page
function navigateHome() {
    // Logic to navigate to the home page
    window.location.href = 'home.html'; // Change this to your actual home page URL
}

// Function to show help information
function getHelp() {
    // Logic to show help information
    window.location.href = 'index.html'; // Change this to your actual home page URL

}
